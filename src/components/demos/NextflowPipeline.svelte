<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type RunStatus = 'queued' | 'starting' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'unknown';

  type PipelineType = 'hello' | 'rnaseq-test' | 'parallel-demo';

  interface PipelineOption {
    id: PipelineType;
    label: string;
    duration: string;
  }

  interface RunResponse {
    run_id: string;
    status: RunStatus;
    attached: boolean;
    websocket_url?: string;
  }

  interface ActiveRunStatus {
    active: boolean;
    run?: {
      run_id: string;
      status: RunStatus;
      triggered_by: string;
    };
    progress_percent?: number;
    log_preview?: string[];
    connected_clients?: number;
  }

  const pipelines: PipelineOption[] = [
    { id: 'hello', label: 'Hello World', duration: '~30s' },
    { id: 'rnaseq-test', label: 'RNA-seq Demo', duration: '~2min' },
    { id: 'parallel-demo', label: 'Parallel Demo', duration: '~3min' }
  ];

  let activeRun: {
    run_id: string;
    status: RunStatus;
    attached: boolean;
  } | null = null;

  let isRunning = false;
  let progressPercent = 0;
  let elapsedTime = 0;
  let startTime: number | null = null;
  let timerInterval: number | null = null;
  let statusPollInterval: number | null = null;
  let logLines: string[] = [];
  let errorMessage: string | null = null;
  let ws: WebSocket | null = null;
  let logViewerElement: HTMLDivElement;
  let isUserScrolling = false;
  let isBackendAvailable = true;
  let isCheckingHealth = true;

  function getStatusColor(status: RunStatus): string {
    switch (status) {
      case 'running':
      case 'starting':
      case 'queued':
        return 'var(--color-science-green)';
      case 'succeeded':
        return 'var(--color-primary)';
      case 'failed':
      case 'unknown':
        return 'var(--color-accent-error)';
      case 'cancelled':
        return 'var(--color-text-muted)';
      default:
        return 'var(--color-border)';
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    elapsedTime = 0;
    timerInterval = window.setInterval(() => {
      if (startTime) {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  async function fetchStatus() {
    try {
      const response = await fetch('/api/v1/pipeline/status');
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - stop polling temporarily
          console.warn('Rate limited, stopping status polling');
          stopStatusPolling();
          return;
        }
        if (response.status === 500 || response.status === 502 || response.status === 503) {
          throw new Error('Backend API unavailable. Is the Nextflow service running?');
        }
        throw new Error(`Status check failed: ${response.status}`);
      }
      const data: ActiveRunStatus = await response.json();

      if (data.active && data.run) {
        activeRun = {
          run_id: data.run.run_id,
          status: data.run.status,
          attached: true
        };
        progressPercent = data.progress_percent ?? 0;

        if (data.log_preview) {
          logLines = data.log_preview;
        }

        const runningStatuses: RunStatus[] = ['queued', 'starting', 'running'];
        isRunning = runningStatuses.includes(data.run.status);

        if (isRunning && !startTime) {
          startTimer();
          // Connect WebSocket if not already connected
          if (!ws) {
            connectWebSocket();
          }
        } else if (!isRunning) {
          stopTimer();
          disconnectWebSocket();
        }
      } else {
        if (activeRun && isRunning) {
          // Run completed - update to final status
          isRunning = false;
          stopTimer();
          stopStatusPolling();
          disconnectWebSocket();

          // Show completion message
          if (data.run) {
            activeRun.status = data.run.status;
            logLines.push(`Pipeline ${data.run.status}: ${activeRun.run_id}`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to fetch status';
    }
  }

  function startStatusPolling() {
    if (statusPollInterval) return;
    // Poll every 2 seconds as fallback when WebSocket unavailable
    statusPollInterval = window.setInterval(fetchStatus, 2000);
  }

  function stopStatusPolling() {
    if (statusPollInterval) {
      clearInterval(statusPollInterval);
      statusPollInterval = null;
    }
  }

  function connectWebSocket() {
    if (ws) {
      ws.close();
    }

    // Determine WebSocket URL based on current location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/v1/pipeline/stream`;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        errorMessage = null;
        // Stop polling since WebSocket is working
        stopStatusPolling();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case 'log':
              if (message.data?.lines && Array.isArray(message.data.lines)) {
                logLines = [...logLines, ...message.data.lines];
                scrollLogToBottom();
              }
              break;

            case 'status':
              if (message.data?.status) {
                if (activeRun) {
                  activeRun.status = message.data.status;
                }
                const runningStatuses: RunStatus[] = ['queued', 'starting', 'running'];
                isRunning = runningStatuses.includes(message.data.status);

                if (!isRunning) {
                  stopTimer();
                }
              }
              break;

            case 'progress':
              if (typeof message.data?.percent === 'number') {
                progressPercent = message.data.percent;
              }
              break;

            case 'complete':
              if (activeRun && message.data?.status) {
                activeRun.status = message.data.status;
              }
              isRunning = false;
              stopTimer();
              disconnectWebSocket();
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        errorMessage = 'WebSocket connection error. Falling back to polling.';
        // Fall back to polling
        startStatusPolling();
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        ws = null;
        // If pipeline is still running, fall back to polling
        if (isRunning) {
          console.log('Falling back to polling for status updates');
          startStatusPolling();
        }
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      errorMessage = 'Failed to establish WebSocket connection. Using polling instead.';
      startStatusPolling();
    }
  }

  function disconnectWebSocket() {
    if (ws) {
      ws.close();
      ws = null;
    }
  }

  function scrollLogToBottom() {
    if (!isUserScrolling && logViewerElement) {
      setTimeout(() => {
        logViewerElement.scrollTop = logViewerElement.scrollHeight;
      }, 0);
    }
  }

  function handleLogScroll() {
    if (!logViewerElement) return;

    // Check if user is scrolling away from bottom
    const isAtBottom =
      Math.abs(logViewerElement.scrollHeight - logViewerElement.scrollTop - logViewerElement.clientHeight) < 10;

    isUserScrolling = !isAtBottom;
  }

  async function startPipeline(pipeline: PipelineType) {
    if (isRunning) return;

    errorMessage = null;
    logLines = [];

    try {
      const response = await fetch('/api/v1/pipeline/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parameters: { pipeline },
          triggered_by: 'web-ui'
        })
      });

      if (!response.ok) {
        if (response.status === 500 || response.status === 502 || response.status === 503) {
          throw new Error('Backend API unavailable. Please ensure the Nextflow service is running on localhost:8000');
        }
        throw new Error(`Failed to start pipeline: ${response.status}`);
      }

      const data: RunResponse = await response.json();

      activeRun = {
        run_id: data.run_id,
        status: data.status,
        attached: data.attached
      };

      isRunning = true;
      progressPercent = 0;
      startTimer();

      // Connect WebSocket for real-time updates (will fall back to polling on error)
      connectWebSocket();

      logLines.push(`Pipeline started: ${data.run_id}`);
      if (data.attached) {
        logLines.push(`Attached to existing run`);
      }
    } catch (error) {
      console.error('Failed to start pipeline:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to start pipeline';
      isRunning = false;
    }
  }

  async function cancelPipeline() {
    if (!activeRun) return;

    try {
      const response = await fetch('/api/v1/pipeline/cancel', {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 500 || response.status === 502 || response.status === 503) {
          throw new Error('Backend API unavailable');
        }
        throw new Error(`Failed to cancel pipeline: ${response.status}`);
      }

      logLines.push(`Cancellation requested`);

      // Status polling will pick up the cancelled state
    } catch (error) {
      console.error('Failed to cancel pipeline:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to cancel pipeline';
    }
  }

  async function checkBackendHealth() {
    isCheckingHealth = true;
    try {
      const response = await fetch('/api/v1/pipeline/status');
      if (response.ok) {
        isBackendAvailable = true;
        // If backend is available, check for existing run
        fetchStatus();
      } else {
        isBackendAvailable = false;
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      isBackendAvailable = false;
    } finally {
      isCheckingHealth = false;
    }
  }

  onMount(() => {
    // Check backend health first
    checkBackendHealth();
  });

  onDestroy(() => {
    stopTimer();
    stopStatusPolling();
    disconnectWebSocket();
  });
</script>

<div class="nextflow-demo">
  <header>
    <p class="u-title-overline">Live Demo</p>
    <h3>Nextflow Pipeline Runner</h3>
    <p>
      Launch bioinformatics workflows directly on my Kubernetes cluster. Watch real-time logs and execution progress in a sandboxed environment.
    </p>
  </header>

  {#if !isBackendAvailable && !isCheckingHealth}
    <div class="maintenance-notice">
      <div class="maintenance-notice__content">
        <div class="maintenance-notice__title">
          <div class="maintenance-notice__indicator"></div>
          <h4>Down for Maintenance</h4>
        </div>
        <p>The pipeline runner is temporarily unavailable. Please check back later.</p>
        <button class="retry-btn" onclick={checkBackendHealth}>
          Retry Connection
        </button>
      </div>
    </div>
  {:else if isCheckingHealth}
    <div class="maintenance-notice">
      <div class="maintenance-notice__content">
        <p>Checking backend availability...</p>
      </div>
    </div>
  {:else}
    <div class="pipeline-controls">
    <div class="pipeline-buttons">
      {#each pipelines as pipeline}
        <button
          class="pipeline-btn"
          disabled={isRunning}
          onclick={() => startPipeline(pipeline.id)}
        >
          <span class="pipeline-btn__label">{pipeline.label}</span>
          <span class="pipeline-btn__duration">{pipeline.duration}</span>
        </button>
      {/each}
    </div>

    {#if activeRun}
      <div class="status-panel">
        <div class="status-header">
          <div class="status-badge" style="--status-color: {getStatusColor(activeRun.status)}">
            <span class="status-indicator"></span>
            <span class="status-text">{activeRun.status}</span>
          </div>
          <div class="status-meta">
            <span class="elapsed-time">{formatTime(elapsedTime)}</span>
            {#if activeRun.attached}
              <span class="attached-indicator" title="Attached to existing run">
                Attached
              </span>
            {/if}
          </div>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            style="width: {progressPercent}%; background: {getStatusColor(activeRun.status)}"
          ></div>
          <span class="progress-text">{progressPercent}%</span>
        </div>

        {#if isRunning}
          <button class="cancel-btn" onclick={cancelPipeline}>
            Cancel Run
          </button>
        {/if}
      </div>
    {/if}
  </div>

    {#if errorMessage}
      <div class="error-message">
        <strong>Error:</strong> {errorMessage}
      </div>
    {/if}

    <div class="log-viewer">
      <div class="log-header">
        <span>Execution Log</span>
        {#if activeRun}
          <span class="log-run-id">Run: {activeRun.run_id}</span>
        {/if}
      </div>
      <div class="log-content" bind:this={logViewerElement} onscroll={handleLogScroll}>
        {#if logLines.length === 0}
          <div class="log-empty">
            Select a pipeline to start
          </div>
        {:else}
          {#each logLines as line}
            <div class="log-line">{line}</div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .nextflow-demo {
    display: grid;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: color-mix(in oklab, var(--color-surface) 85%, transparent 15%);
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in oklab, var(--color-border) 50%, transparent 50%);
  }

  header h3 {
    font-size: var(--heading-md);
  }

  header p {
    max-width: 68ch;
  }

  .pipeline-controls {
    display: grid;
    gap: var(--space-md);
  }

  .pipeline-buttons {
    display: grid;
    gap: var(--space-sm);
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .pipeline-btn {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: var(--space-sm) var(--space-md);
    background: color-mix(in oklab, var(--color-surface-muted) 60%, transparent 40%);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    color: var(--color-text);
  }

  .pipeline-btn:hover:not(:disabled) {
    background: color-mix(in oklab, var(--color-primary) 15%, var(--color-surface-muted) 85%);
    border-color: var(--color-primary);
    transform: translateY(-1px);
  }

  .pipeline-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pipeline-btn__label {
    font-weight: 500;
    font-size: 0.95rem;
  }

  .pipeline-btn__duration {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .status-panel {
    display: grid;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: color-mix(in oklab, var(--color-surface-strong) 40%, transparent 60%);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 40%, transparent 60%);
  }

  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    background: color-mix(in oklab, var(--status-color) 20%, transparent 80%);
    border: 1px solid color-mix(in oklab, var(--status-color) 50%, transparent 50%);
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status-color);
    animation: pulse 2s ease-in-out infinite;
  }

  .status-text {
    text-transform: capitalize;
  }

  .status-meta {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .elapsed-time {
    font-variant-numeric: tabular-nums;
  }

  .attached-indicator {
    padding: 0.25rem 0.5rem;
    background: color-mix(in oklab, var(--color-science-purple) 20%, transparent 80%);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
  }

  .progress-bar {
    position: relative;
    height: 24px;
    background: color-mix(in oklab, var(--color-surface-muted) 70%, transparent 30%);
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid color-mix(in oklab, var(--color-border) 30%, transparent 70%);
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: inherit;
  }

  .progress-text {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .cancel-btn {
    padding: var(--space-sm) var(--space-md);
    background: color-mix(in oklab, var(--color-accent-error) 15%, transparent 85%);
    border: 1px solid color-mix(in oklab, var(--color-accent-error) 50%, transparent 50%);
    border-radius: var(--radius-md);
    color: var(--color-accent-error);
    font-family: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cancel-btn:hover {
    background: color-mix(in oklab, var(--color-accent-error) 25%, transparent 75%);
    border-color: var(--color-accent-error);
  }

  .maintenance-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);
    background: color-mix(in oklab, var(--color-surface-muted) 60%, transparent 40%);
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in oklab, var(--color-border) 50%, transparent 50%);
    text-align: center;
  }

  .maintenance-notice__content {
    display: grid;
    gap: var(--space-sm);
  }

  .maintenance-notice__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
  }

  .maintenance-notice__indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
    box-shadow:
      0 0 0 4px rgba(239, 68, 68, 0.2),
      0 0 18px rgba(239, 68, 68, 0.5),
      0 0 36px rgba(239, 68, 68, 0.3);
    animation: pulse-red 2s ease-in-out infinite;
  }

  .maintenance-notice__content h4 {
    font-size: var(--heading-lg);
    margin: 0;
    font-weight: 600;
    font-family: var(--font-serif);
    letter-spacing: 0.01em;
  }

  .maintenance-notice__content p {
    color: var(--color-text-muted);
    margin: 0;
  }

  .retry-btn {
    margin-top: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    background: color-mix(in oklab, var(--color-primary) 20%, transparent 80%);
    border: 1px solid color-mix(in oklab, var(--color-primary) 50%, transparent 50%);
    border-radius: var(--radius-md);
    color: var(--color-primary);
    font-family: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-btn:hover {
    background: color-mix(in oklab, var(--color-primary) 30%, transparent 70%);
    border-color: var(--color-primary);
  }

  .error-message {
    padding: var(--space-sm) var(--space-md);
    background: color-mix(in oklab, var(--color-accent-error) 10%, transparent 90%);
    border: 1px solid color-mix(in oklab, var(--color-accent-error) 40%, transparent 60%);
    border-radius: var(--radius-md);
    color: var(--color-accent-error);
    font-size: 0.9rem;
  }

  .log-viewer {
    display: grid;
    grid-template-rows: auto 1fr;
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 50%, transparent 50%);
    background: color-mix(in oklab, var(--color-surface-strong) 60%, transparent 40%);
    overflow: hidden;
    min-height: 200px;
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: color-mix(in oklab, var(--color-surface-muted) 80%, transparent 20%);
    border-bottom: 1px solid color-mix(in oklab, var(--color-border) 40%, transparent 60%);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text-muted);
  }

  .log-run-id {
    font-size: 0.75rem;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    opacity: 0.7;
  }

  .log-content {
    padding: var(--space-md);
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    overflow-y: auto;
    max-height: 300px;
  }

  .log-empty {
    color: var(--color-text-muted);
    font-style: italic;
    text-align: center;
    padding: var(--space-lg);
  }

  .log-line {
    color: var(--color-text);
    margin-bottom: 0.25rem;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes pulse-red {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .status-indicator,
    .maintenance-notice__indicator {
      animation: none;
    }
  }

  @media (min-width: 768px) {
    .pipeline-buttons {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>