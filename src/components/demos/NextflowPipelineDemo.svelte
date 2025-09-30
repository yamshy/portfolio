<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';

  type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

  interface PipelineOption {
    id: 'hello' | 'rnaseq-test' | 'parallel-demo';
    name: string;
    description: string;
    runtime: string;
  }

  interface ActiveRun {
    run_id?: string | null;
    runId?: string | null;
    status?: string | null;
    started_at?: string | null;
    finished_at?: string | null;
    job_name?: string | null;
    message?: string | null;
    triggered_by?: string | null;
  }

  interface HistoryEntry {
    run_id: string;
    status: string;
    duration: number | null;
    started_at: string;
    triggered_by?: string | null;
  }

  const pipelines: PipelineOption[] = [
    {
      id: 'hello',
      name: 'Hello World',
      description: 'Single-process smoke test for the demo cluster.',
      runtime: '~30 seconds',
    },
    {
      id: 'rnaseq-test',
      name: 'RNA-seq Demo',
      description: 'Multi-stage workflow covering alignment, quantification, and QC.',
      runtime: '~2 minutes',
    },
    {
      id: 'parallel-demo',
      name: 'Parallel Demo',
      description: 'Fan-out/fan-in example showcasing horizontal execution.',
      runtime: '~3 minutes',
    },
  ];

  const statusLabels: Record<string, string> = {
    idle: 'Idle',
    queued: 'Queued',
    starting: 'Starting',
    running: 'Running',
    succeeded: 'Succeeded',
    failed: 'Failed',
    cancelled: 'Cancelled',
    cancelling: 'Cancelling',
    unknown: 'Unknown',
  };

  const statusVariants: Record<string, 'neutral' | 'success' | 'danger' | 'warning'> = {
    idle: 'neutral',
    queued: 'warning',
    starting: 'warning',
    running: 'warning',
    succeeded: 'success',
    failed: 'danger',
    cancelled: 'danger',
    cancelling: 'warning',
    unknown: 'neutral',
  };

  const isActiveStatus = (status: string) =>
    ['queued', 'starting', 'running', 'canceling', 'cancelling'].includes(status);

  const normalizeStatus = (status: string | null | undefined) => {
    if (!status) return 'unknown';
    const normalized = status.toLowerCase();
    if (normalized === 'cancelling' || normalized === 'canceling') return 'cancelling';
    if (normalized === 'canceled') return 'cancelled';
    return normalized;
  };

  const formatDuration = (totalSeconds: number) => {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '—';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedMinutes = `${hours ? String(minutes).padStart(2, '0') : minutes}`;
    const paddedSeconds = String(seconds).padStart(2, '0');

    return hours
      ? `${hours}:${paddedMinutes}:${paddedSeconds}`
      : `${paddedMinutes}:${paddedSeconds}`;
  };

  const connectionCopy: Record<ConnectionState, string> = {
    connecting: 'Connecting…',
    connected: 'Live updates',
    reconnecting: 'Reconnecting…',
    disconnected: 'Connection lost',
  };

  const formatTimestamp = (value: string | null | undefined) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString();
  };

  let selectedPipeline: PipelineOption['id'] = pipelines[0].id;
  let isModalOpen = false;
  let isStartingRun = false;
  let isCancellingRun = false;
  let startError = '';
  let cancelError = '';
  let historyError = '';
  let historyLoading = false;
  let history: HistoryEntry[] = [];
  let attachedToRun = false;
  let progress = 0;
  let logs: string[] = [];
  let connectionState: ConnectionState = 'connecting';
  let websocket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let logContainer: HTMLDivElement | null = null;
  let autoScroll = true;
  let elapsedSeconds = 0;
  let elapsedTimer: ReturnType<typeof setInterval> | null = null;

  let currentRun = {
    runId: null as string | null,
    status: 'idle',
    startedAt: null as string | null,
    finishedAt: null as string | null,
    message: null as string | null,
    jobName: null as string | null,
  };

  const isRunActive = () => isActiveStatus(currentRun.status);

  const resetLogsIfFreshRun = (incomingRunId: string | null) => {
    if (!incomingRunId || !currentRun.runId || incomingRunId === currentRun.runId) return;
    logs = [];
  };

  const stopElapsedTimer = () => {
    if (elapsedTimer) {
      clearInterval(elapsedTimer);
      elapsedTimer = null;
    }
  };

  const startElapsedTimer = (startedAt: string | null) => {
    stopElapsedTimer();
    if (!startedAt) {
      elapsedSeconds = 0;
      return;
    }

    const startValue = new Date(startedAt).getTime();
    if (Number.isNaN(startValue)) {
      elapsedSeconds = 0;
      return;
    }

    const tickElapsed = () => {
      const now = Date.now();
      elapsedSeconds = Math.max(0, Math.floor((now - startValue) / 1000));
    };

    tickElapsed();
    elapsedTimer = setInterval(tickElapsed, 1000);
  };

  const applyRunPayload = (run: ActiveRun | null | undefined) => {
    if (!run) return;

    const runId = run.run_id ?? run.runId ?? null;
    const status = normalizeStatus(run.status ?? currentRun.status);

    resetLogsIfFreshRun(runId);

    currentRun = {
      runId,
      status,
      startedAt: run.started_at ?? currentRun.startedAt,
      finishedAt: run.finished_at ?? currentRun.finishedAt,
      message: run.message ?? currentRun.message,
      jobName: run.job_name ?? currentRun.jobName,
    };

    if (currentRun.startedAt && isActiveStatus(status)) {
      startElapsedTimer(currentRun.startedAt);
    } else if (currentRun.finishedAt) {
      stopElapsedTimer();
      if (currentRun.startedAt) {
        const startedValue = new Date(currentRun.startedAt).getTime();
        const finishedValue = new Date(currentRun.finishedAt).getTime();
        if (!Number.isNaN(startedValue) && !Number.isNaN(finishedValue)) {
          elapsedSeconds = Math.max(0, Math.floor((finishedValue - startedValue) / 1000));
        }
      }
    }

    if (!isActiveStatus(status)) {
      progress = status === 'succeeded' ? 100 : progress;
    }
  };

  const fetchActiveRun = async () => {
    try {
      const response = await fetch('/api/v1/pipeline/active');
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const payload = await response.json();
      if (payload?.run) {
        applyRunPayload(payload.run as ActiveRun);
      } else if (!payload?.active) {
        currentRun = {
          runId: null,
          status: 'idle',
          startedAt: null,
          finishedAt: null,
          message: null,
          jobName: null,
        };
        stopElapsedTimer();
        progress = 0;
      }
    } catch (error) {
      console.error('Failed to fetch active run', error);
    }
  };

  const fetchLatestStatus = async () => {
    try {
      const response = await fetch('/api/v1/pipeline/status');
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const payload = await response.json();

      if (payload?.run) {
        applyRunPayload(payload.run as ActiveRun);
      } else if (payload?.status) {
        applyRunPayload({
          status: payload.status as string,
          run_id: payload.run_id ?? payload.runId ?? currentRun.runId,
          started_at: payload.started_at ?? payload.startedAt ?? currentRun.startedAt,
          finished_at: payload.finished_at ?? payload.finishedAt ?? currentRun.finishedAt,
          message: payload.message ?? currentRun.message,
        });
      }
    } catch (error) {
      console.error('Failed to fetch latest status', error);
    }
  };

  const fetchHistory = async () => {
    historyLoading = true;
    historyError = '';
    try {
      const response = await fetch('/api/v1/pipeline/history?limit=10');
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const payload = await response.json();
      if (Array.isArray(payload)) {
        history = payload as HistoryEntry[];
      } else if (Array.isArray(payload?.history)) {
        history = payload.history as HistoryEntry[];
      } else {
        history = [];
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
      historyError =
        error instanceof Error ? error.message : 'Unable to load run history. Please retry.';
    } finally {
      historyLoading = false;
    }
  };

  const connectWebSocket = () => {
    if (typeof window === 'undefined') return;

    if (websocket) {
      websocket.close();
      websocket = null;
    }

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socketUrl = `${protocol}://${window.location.host}/api/v1/pipeline/stream`;

    connectionState = connectionState === 'disconnected' ? 'reconnecting' : 'connecting';

    websocket = new WebSocket(socketUrl);

    websocket.addEventListener('open', () => {
      connectionState = 'connected';
    });

    websocket.addEventListener('close', () => {
      connectionState = 'disconnected';
      scheduleReconnect();
    });

    websocket.addEventListener('error', () => {
      connectionState = 'disconnected';
      websocket?.close();
    });

    websocket.addEventListener('message', async (event) => {
      try {
        const payload = JSON.parse(event.data ?? '{}');
        const type = payload?.type;
        const data = payload?.data ?? {};

        if (type === 'status') {
          resetLogsIfFreshRun(data?.run_id ?? data?.runId ?? null);
          applyRunPayload(data as ActiveRun);
          if (data?.status) currentRun.status = normalizeStatus(data.status as string);
          if (data?.started_at) startElapsedTimer(data.started_at as string);
        }

        if (type === 'progress') {
          const percent = Number(data?.percent);
          if (Number.isFinite(percent)) {
            progress = Math.max(0, Math.min(100, percent));
          }
        }

        if (type === 'log') {
          const lines: string[] = Array.isArray(data?.lines) ? data.lines : [];
          if (lines.length) {
            logs = [...logs, ...lines];
            await tick();
            if (autoScroll && logContainer) {
              logContainer.scrollTop = logContainer.scrollHeight;
            }
          }
        }

        if (type === 'complete') {
          const completionStatus = normalizeStatus(data?.status);
          currentRun = {
            ...currentRun,
            status: completionStatus,
            finishedAt: (data?.finished_at as string | undefined) ?? new Date().toISOString(),
            message: (data?.message as string | undefined) ?? currentRun.message,
          };
          if (Number.isFinite(data?.duration)) {
            elapsedSeconds = Math.max(0, Math.floor(Number(data.duration)));
          } else if (currentRun.startedAt) {
            const startValue = new Date(currentRun.startedAt).getTime();
            const finishValue = new Date(currentRun.finishedAt ?? '').getTime();
            if (!Number.isNaN(startValue) && !Number.isNaN(finishValue)) {
              elapsedSeconds = Math.max(0, Math.floor((finishValue - startValue) / 1000));
            }
          }
          if (!isActiveStatus(completionStatus)) {
            stopElapsedTimer();
          }
          progress = completionStatus === 'succeeded' ? 100 : progress;
          await fetchActiveRun();
          await fetchHistory();
          attachedToRun = false;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    });
  };

  const scheduleReconnect = () => {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      connectionState = 'reconnecting';
      connectWebSocket();
    }, 4000);
  };

  const handleStartRun = async () => {
    startError = '';
    attachedToRun = false;

    if (isRunActive() && !isModalOpen) {
      isModalOpen = true;
    }

    isStartingRun = true;
    try {
      const response = await fetch('/api/v1/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parameters: { pipeline: selectedPipeline },
          triggered_by: 'web-ui',
        }),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const payload = await response.json();

      attachedToRun = Boolean(payload?.attached);
      const runId = payload?.run_id ?? payload?.runId ?? null;
      const status = normalizeStatus(payload?.status);

      currentRun = {
        ...currentRun,
        runId,
        status,
        startedAt: attachedToRun ? currentRun.startedAt : new Date().toISOString(),
        message: payload?.message ?? currentRun.message,
        jobName: payload?.job_name ?? currentRun.jobName,
        finishedAt: null,
      };

      if (!attachedToRun) {
        logs = [];
        progress = 0;
        startElapsedTimer(currentRun.startedAt);
      }

      if (!isModalOpen) {
        isModalOpen = true;
      }

      await fetchActiveRun();
      await fetchHistory();
    } catch (error) {
      console.error('Failed to start pipeline run', error);
      startError =
        error instanceof Error ? error.message : 'Unable to start the pipeline. Please retry.';
    } finally {
      isStartingRun = false;
    }
  };

  const handleCancelRun = async () => {
    cancelError = '';
    if (!isRunActive()) return;

    isCancellingRun = true;
    try {
      const response = await fetch('/api/v1/pipeline/cancel', { method: 'DELETE' });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      currentRun = {
        ...currentRun,
        status: 'cancelled',
        finishedAt: new Date().toISOString(),
      };
      stopElapsedTimer();
      progress = 0;
      await fetchActiveRun();
      await fetchHistory();
      attachedToRun = false;
    } catch (error) {
      console.error('Failed to cancel run', error);
      cancelError =
        error instanceof Error ? error.message : 'Unable to cancel the run. Please retry.';
    } finally {
      isCancellingRun = false;
    }
  };

  const handleLogScroll = () => {
    if (!logContainer) return;
    const { scrollTop, scrollHeight, clientHeight } = logContainer;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 32;
    autoScroll = nearBottom;
  };

  const jumpToLatestLog = () => {
    if (!logContainer) return;
    logContainer.scrollTop = logContainer.scrollHeight;
    autoScroll = true;
  };

  const openModal = () => {
    isModalOpen = true;
    if (!history.length) {
      fetchHistory();
    }
  };

  const closeModal = () => {
    isModalOpen = false;
  };

  onMount(() => {
    fetchActiveRun();
    fetchLatestStatus();
    fetchHistory();
    connectWebSocket();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && connectionState === 'disconnected') {
        connectWebSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  onDestroy(() => {
    stopElapsedTimer();
    if (websocket) {
      websocket.close();
      websocket = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });

  const statusVariant = () => statusVariants[currentRun.status] ?? 'neutral';

  const statusLabel = () => statusLabels[currentRun.status] ?? statusLabels.unknown;

  const connectionClass = () => `connection-indicator connection-indicator--${connectionState}`;

  const badgeLabel = () => (isRunActive() ? 'Live Run' : 'Live Demo');

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement && event.target.dataset.overlay === 'backdrop') {
      closeModal();
    }
  };
</script>

<article class="insight-card insight-card--nextflow" data-reveal>
  <header class="insight-card__header">
    <span class="insight-card__badge insight-card__badge--live">{badgeLabel()}</span>
    <h3>Try Nextflow on My Cluster</h3>
  </header>
  <p>
    Kick off a sandbox Nextflow pipeline on my Kubernetes cluster. The UI streams live logs,
    status updates, and run history so multiple viewers can follow along together.
  </p>
  <div class="nextflow-card__footer">
    <span class={`status-chip status-chip--${statusVariant()}`}>{statusLabel()}</span>
    <button
      class="nextflow-card__action"
      type="button"
      on:click={openModal}
      aria-haspopup="dialog"
      aria-expanded={isModalOpen}
    >
      {isRunActive() ? 'View Active Run' : 'Launch Demo'}
    </button>
  </div>
  <div class="insight-card__visual insight-card__visual--nextflow" aria-hidden="true">
    <div class="terminal">
      <div class="terminal__header">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="terminal__body">
        <span class="line line--prompt"></span>
        <span class="line"></span>
        <span class="line"></span>
        <span class="line line--progress"></span>
      </div>
    </div>
  </div>
  <div class="nextflow-card__actions">
    <button
      class="start-run-button"
      type="button"
      on:click={handleStartRun}
      disabled={isRunActive() || isStartingRun}
    >
      {isRunActive() ? 'View Active Run' : isStartingRun ? 'Starting…' : 'Start Pipeline'}
    </button>
    <p class="start-run-button__hint">
      Only one run can execute at a time. If a run is active, you will attach to it automatically.
    </p>
    {#if startError}
      <p class="form-error">{startError}</p>
    {/if}
    {#if attachedToRun && currentRun.runId}
      <p class="attached-notice">Attached to run <code>{currentRun.runId}</code>.</p>
    {/if}
  </div>
</article>
{#if isModalOpen}
  <div
    class="nextflow-modal"
    role="presentation"
    data-overlay="backdrop"
    on:click={handleBackdropClick}
  >
    <section class="nextflow-modal__dialog" role="dialog" aria-modal="true" aria-label="Nextflow pipeline demo">
      <header class="nextflow-modal__header">
        <div>
          <p class="u-title-overline">Cluster Sandbox</p>
          <h2>Nextflow Pipeline Demo</h2>
          <p>
            Manage a real pipeline run using the shared demo cluster. The interface reflects the
            cluster-wide state, so everyone sees the same execution in real time.
          </p>
        </div>
        <div class="header-meta">
          <span class={connectionClass()} aria-live="polite">{connectionCopy[connectionState]}</span>
          <button class="close-button" type="button" on:click={closeModal}>
            Close
          </button>
        </div>
      </header>

      <div class="nextflow-modal__grid">
        <section class="panel panel--controls" aria-label="Run controls">
          <h3>Choose a pipeline</h3>
          <div class="pipeline-options">
            {#each pipelines as pipeline}
              <label
                class={`pipeline-card ${selectedPipeline === pipeline.id ? 'pipeline-card--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="pipeline"
                  value={pipeline.id}
                  bind:group={selectedPipeline}
                  disabled={isRunActive()}
                />
                <div>
                  <div class="pipeline-card__header">
                    <h4>{pipeline.name}</h4>
                    <span>{pipeline.runtime}</span>
                  </div>
                  <p>{pipeline.description}</p>
                </div>
              </label>
            {/each}
          </div>
          <button
            class="primary-action"
            type="button"
            on:click={handleStartRun}
            disabled={isRunActive() || isStartingRun}
          >
            {isRunActive() ? 'View Active Run' : isStartingRun ? 'Starting…' : 'Start Selected Pipeline'}
          </button>
          {#if startError}
            <p class="form-error">{startError}</p>
          {/if}
          {#if attachedToRun && currentRun.runId}
            <p class="attached-notice">Attached to run <code>{currentRun.runId}</code>.</p>
          {/if}
          <button
            class="secondary-action"
            type="button"
            on:click={handleCancelRun}
            disabled={!isRunActive() || isCancellingRun}
          >
            {isCancellingRun ? 'Cancelling…' : 'Cancel Active Run'}
          </button>
          {#if cancelError}
            <p class="form-error">{cancelError}</p>
          {/if}
        </section>

        <section class="panel panel--status" aria-label="Run status">
          <div class="status-row">
            <span class={`status-chip status-chip--${statusVariant()}`}>{statusLabel()}</span>
            {#if currentRun.runId}
              <span class="run-id">Run <code>{currentRun.runId}</code></span>
            {/if}
          </div>
          <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
            <div class="progress-bar__fill" style={`width: ${progress}%`}></div>
          </div>
          <dl class="status-metrics">
            <div>
              <dt>Elapsed</dt>
              <dd>{formatDuration(elapsedSeconds)}</dd>
            </div>
            <div>
              <dt>Job</dt>
              <dd>{currentRun.jobName ?? '—'}</dd>
            </div>
          </dl>
          {#if currentRun.message}
            <p class="status-message">{currentRun.message}</p>
          {/if}
        </section>

        <section class="panel panel--logs" aria-label="Live logs">
          <header class="logs-header">
            <h3>Live logs</h3>
            {#if !autoScroll}
              <button type="button" class="jump-button" on:click={jumpToLatestLog}>
                Jump to latest
              </button>
            {/if}
          </header>
          <div
            class="log-viewer"
            bind:this={logContainer}
            on:scroll={handleLogScroll}
            data-autoscroll={autoScroll}
          >
            {#if logs.length === 0}
              <p class="logs-empty">
                Waiting for log output. Once the pipeline emits logs they will stream in here.
              </p>
            {:else}
              <ul>
                {#each logs as line, index}
                  <li aria-live={index === logs.length - 1 ? 'polite' : undefined}>{line}</li>
                {/each}
              </ul>
            {/if}
          </div>
        </section>

        <section class="panel panel--history" aria-label="Recent runs">
          <header class="history-header">
            <h3>Recent runs</h3>
            <button class="refresh-button" type="button" on:click={fetchHistory} disabled={historyLoading}>
              {historyLoading ? 'Refreshing…' : 'Refresh'}
            </button>
          </header>
          {#if historyError}
            <p class="form-error">{historyError}</p>
          {/if}
          {#if historyLoading && !history.length}
            <p class="history-loading">Loading history…</p>
          {:else if !history.length}
            <p class="history-empty">No runs recorded yet.</p>
          {:else}
            <table>
              <thead>
                <tr>
                  <th scope="col">Run ID</th>
                  <th scope="col">Status</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Started</th>
                  <th scope="col">Triggered By</th>
                </tr>
              </thead>
              <tbody>
                {#each history as entry}
                  <tr>
                    <td><code>{entry.run_id}</code></td>
                    <td>
                      <span class={`status-chip status-chip--${statusVariants[normalizeStatus(entry.status)] ?? 'neutral'}`}>
                        {statusLabels[normalizeStatus(entry.status)] ?? statusLabels.unknown}
                      </span>
                    </td>
                    <td>{entry.duration != null ? formatDuration(entry.duration) : '—'}</td>
                    <td>{formatTimestamp(entry.started_at)}</td>
                    <td>{entry.triggered_by ?? '—'}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </section>
      </div>
    </section>
  </div>
{/if}
<style>
  .nextflow-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .nextflow-card__action {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-pill);
    border: none;
    background: var(--color-primary);
    color: var(--color-bg);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: transform var(--duration-fast) var(--ease-smooth);
  }

  .nextflow-card__action:hover,
  .nextflow-card__action:focus-visible {
    transform: translateY(-1px);
  }

  .nextflow-card__actions {
    display: grid;
    gap: var(--space-xs);
  }

  .start-run-button {
    padding: 0.5rem 0.85rem;
    border-radius: var(--radius-pill);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    background: color-mix(in oklab, var(--color-surface) 85%, transparent 15%);
    font-weight: 600;
    cursor: pointer;
    transition: border-color var(--duration-base) var(--ease-smooth);
  }

  .start-run-button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .start-run-button__hint {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .attached-notice {
    font-size: 0.8rem;
    color: var(--color-primary);
  }

  .form-error {
    font-size: 0.8rem;
    color: var(--color-danger);
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    background: color-mix(in oklab, var(--color-surface) 90%, transparent 10%);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    color: var(--color-text);
    white-space: nowrap;
  }

  .status-chip--success {
    color: color-mix(in oklab, var(--color-success) 85%, var(--color-text) 15%);
    border-color: color-mix(in oklab, var(--color-success) 55%, transparent 45%);
    background: color-mix(in oklab, var(--color-success) 15%, transparent 85%);
  }

  .status-chip--warning {
    color: color-mix(in oklab, var(--color-warning) 80%, var(--color-text) 20%);
    border-color: color-mix(in oklab, var(--color-warning) 45%, transparent 55%);
    background: color-mix(in oklab, var(--color-warning) 18%, transparent 82%);
  }

  .status-chip--danger {
    color: color-mix(in oklab, var(--color-danger) 85%, var(--color-text) 15%);
    border-color: color-mix(in oklab, var(--color-danger) 55%, transparent 45%);
    background: color-mix(in oklab, var(--color-danger) 18%, transparent 82%);
  }

  .status-chip--neutral {
    color: var(--color-text-muted);
  }

  .nextflow-modal {
    position: fixed;
    inset: 0;
    background: color-mix(in oklab, var(--color-bg) 65%, rgba(10, 10, 14, 0.7) 35%);
    backdrop-filter: blur(6px);
    padding: clamp(var(--space-md), 4vw, var(--space-xl));
    display: grid;
    place-items: center;
    z-index: 40;
  }

  .nextflow-modal__dialog {
    width: min(1100px, 100%);
    max-height: min(90vh, 900px);
    background: color-mix(in oklab, var(--color-surface) 92%, transparent 8%);
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    box-shadow: var(--shadow-lg);
    padding: clamp(var(--space-md), 4vw, var(--space-xl));
    display: grid;
    gap: clamp(var(--space-md), 3vw, var(--space-lg));
    overflow: hidden auto;
  }

  .nextflow-modal__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .header-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .close-button {
    border: 1px solid color-mix(in oklab, var(--color-border) 65%, transparent 35%);
    background: transparent;
    border-radius: var(--radius-pill);
    padding: 0.35rem 0.85rem;
    cursor: pointer;
  }

  .connection-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .connection-indicator::before {
    content: '';
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--color-border);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-border) 20%, transparent 80%);
  }

  .connection-indicator--connected::before {
    background: var(--color-success);
  }

  .connection-indicator--connecting::before,
  .connection-indicator--reconnecting::before {
    background: var(--color-warning);
  }

  .connection-indicator--disconnected::before {
    background: var(--color-danger);
  }

  .nextflow-modal__grid {
    display: grid;
    gap: clamp(var(--space-md), 3vw, var(--space-lg));
  }

  .panel {
    display: grid;
    gap: var(--space-md);
    padding: clamp(var(--space-sm), 3vw, var(--space-md));
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 55%, transparent 45%);
    background: color-mix(in oklab, var(--color-surface) 88%, transparent 12%);
  }

  .panel--controls {
    order: 1;
  }

  .panel--status {
    order: 2;
  }

  .panel--logs {
    order: 3;
  }

  .panel--history {
    order: 4;
  }

  .pipeline-options {
    display: grid;
    gap: var(--space-sm);
  }

  .pipeline-card {
    display: grid;
    gap: var(--space-xs);
    padding: var(--space-sm);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 55%, transparent 45%);
    background: color-mix(in oklab, var(--color-surface) 85%, transparent 15%);
    cursor: pointer;
  }

  .pipeline-card input {
    position: absolute;
    opacity: 0;
  }

  .pipeline-card__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-xs);
  }

  .pipeline-card__header span {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .pipeline-card--selected {
    border-color: color-mix(in oklab, var(--color-primary) 55%, transparent 45%);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent 82%);
  }

  .pipeline-card:has(input:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .primary-action,
  .secondary-action {
    padding: 0.65rem 1rem;
    border-radius: var(--radius-pill);
    font-weight: 600;
    cursor: pointer;
  }

  .primary-action {
    border: none;
    background: var(--color-primary);
    color: var(--color-bg);
  }

  .secondary-action {
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    background: transparent;
  }

  .primary-action:disabled,
  .secondary-action:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .run-id {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .progress-bar {
    height: 0.65rem;
    border-radius: 999px;
    background: color-mix(in oklab, var(--color-border) 30%, transparent 70%);
    overflow: hidden;
  }

  .progress-bar__fill {
    height: 100%;
    background: linear-gradient(
      135deg,
      color-mix(in oklab, var(--color-primary) 60%, transparent 40%),
      color-mix(in oklab, var(--color-primary) 80%, transparent 20%)
    );
    transition: width var(--duration-slow) var(--ease-smooth);
  }

  .status-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-sm);
  }

  .status-metrics dt {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
  }

  .status-metrics dd {
    margin: 0;
    font-weight: 600;
  }

  .status-message {
    font-size: 0.9rem;
    color: var(--color-text);
    background: color-mix(in oklab, var(--color-surface-muted) 60%, transparent 40%);
    border-radius: var(--radius-sm);
    padding: 0.75rem;
  }

  .logs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .jump-button,
  .refresh-button {
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    background: transparent;
    border-radius: var(--radius-pill);
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .log-viewer {
    border-radius: var(--radius-sm);
    border: 1px solid color-mix(in oklab, var(--color-border) 55%, transparent 45%);
    background: color-mix(in oklab, var(--color-surface) 85%, transparent 15%);
    min-height: 180px;
    max-height: 320px;
    overflow: auto;
    padding: var(--space-sm);
    font-family: 'Berkeley Mono', 'IBM Plex Mono', 'Fira Code', monospace;
    font-size: 0.85rem;
  }

  .log-viewer ul {
    display: grid;
    gap: 0.35rem;
  }

  .log-viewer li {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .logs-empty {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  thead {
    text-align: left;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
  }

  th,
  td {
    padding: 0.5rem;
    border-bottom: 1px solid color-mix(in oklab, var(--color-border) 45%, transparent 55%);
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: none;
  }

  .history-loading,
  .history-empty {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  @media (min-width: 62rem) {
    .nextflow-modal__grid {
      grid-template-columns: 1.1fr 0.9fr;
      gap: clamp(var(--space-lg), 6vw, var(--space-xl));
    }

    .panel--logs {
      grid-column: span 2;
    }

    .panel--history {
      grid-column: span 2;
    }

    .panel--controls {
      order: 1;
    }

    .panel--status {
      order: 2;
    }

    .panel--logs {
      order: 3;
    }

    .panel--history {
      order: 4;
    }
  }

  @media (max-width: 40rem) {
    .nextflow-card__footer {
      flex-direction: column;
      align-items: flex-start;
    }

    .nextflow-modal {
      padding: var(--space-md);
    }

    .nextflow-modal__dialog {
      padding: var(--space-md);
    }

    .log-viewer {
      max-height: 240px;
    }
  }
</style>
