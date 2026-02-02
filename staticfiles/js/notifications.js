/**
 * Real-time Notification System
 * 
 * Handles WebSocket connections, notification display, and real-time updates.
 * Uses Toastr for popup notifications and a dropdown panel for notification list.
 */

class NotificationManager {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.baseUrl = window.location.origin;
    this.wsUrl = null;
    this.notifications = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.heartbeatInterval = null;
    
    this.init();
  }

  /**
   * Initialize notification system
   */
  async init() {
    // Extract user ID from page (or make an API call to get it)
    try {
      const response = await fetch('/api/user/current/', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.userId = data.id;
        
        // Set up WebSocket URL and connect
        this.setupWebSocket();
      }
    } catch (error) {
      console.error('Failed to initialize notification manager:', error);
      // Fallback: Try to get userId from document data attribute
      const userEl = document.querySelector('[data-user-id]');
      if (userEl) {
        this.userId = userEl.dataset.userId;
        this.setupWebSocket();
      }
    }

    // Load initial notifications
    this.loadNotifications();

    // Set up UI event listeners
    this.setupEventListeners();

    // Set up periodic refresh of notifications
    setInterval(() => this.refreshNotificationCount(), 60000); // Every minute
  }

  /**
   * Setup WebSocket connection for real-time notifications
   */
  setupWebSocket() {
    if (!this.userId) {
      console.warn('User ID not available for WebSocket connection');
      return;
    }

    // Determine WebSocket protocol based on page protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.wsUrl = `${protocol}//${window.location.host}/ws/notification/`;

    console.log('Connecting to WebSocket:', this.wsUrl);
    this.connect();
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect to WebSocket with exponential backoff
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('Max reconnection attempts reached. Falling back to polling.');
      this.startPolling();
    }
  }

  /**
   * Start sending keep-alive pings to WebSocket
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Start polling for new notifications if WebSocket fails
   */
  startPolling() {
    this.pollingInterval = setInterval(() => {
      this.refreshNotificationCount();
      this.loadNotifications();
    }, 10000); // Every 10 seconds
  }

  /**
   * Handle incoming WebSocket message
   */
  handleMessage(data) {
    if (data.type === 'notification') {
      this.addNotification(data);
      this.showToastNotification(data);
      this.refreshNotificationCount();
    } else if (data.type === 'pong') {
      // Keep-alive pong response
      console.log('Keep-alive pong received');
    }
  }

  /**
   * Add notification to the list
   */
  addNotification(notificationData) {
    this.notifications.unshift({
      id: notificationData.notification_id,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.notification_type,
      is_read: notificationData.is_read,
      created_at: new Date(notificationData.created_at),
      redirect_url: notificationData.redirect_url
    });

    // Keep only last 100 notifications in memory
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.renderNotifications();
  }

  /**
   * Show toast notification (Toastr)
   */
  showToastNotification(data) {
    const type = this.mapNotificationType(data.notification_type);
    const options = {
      timeOut: 5000,
      extendedTimeOut: 2000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right'
    };

    toastr[type](data.message, data.title, options);
  }

  /**
   * Map notification type to toastr method
   */
  mapNotificationType(type) {
    const typeMap = {
      'success': 'success',
      'error': 'error',
      'warning': 'warning',
      'report_ready': 'success',
      'report_error': 'error',
      'role_changed': 'info',
      'permission_denied': 'warning',
      'info': 'info'
    };
    return typeMap[type] || 'info';
  }

  /**
   * Load notifications from API
   */
  async loadNotifications() {
    try {
      const response = await fetch('/api/notifications/?limit=20', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (response.ok) {
        const data = await response.json();
        this.notifications = (data.results || data).map(notif => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.notification_type,
          is_read: notif.is_read,
          created_at: new Date(notif.created_at),
          redirect_url: notif.redirect_url
        }));

        this.renderNotifications();
        this.refreshNotificationCount();
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  /**
   * Render notifications in the dropdown panel
   */
  renderNotifications() {
    const panel = document.getElementById('notificationList');
    
    if (!panel) return;

    if (this.notifications.length === 0) {
      panel.innerHTML = '<div class="notification-empty"><p>Você não tem notificações</p></div>';
      return;
    }

    panel.innerHTML = this.notifications.map(notif => `
      <div class="notification-item ${notif.is_read ? '' : 'unread'}" data-notification-id="${notif.id}">
        <div class="notification-icon ${notif.type}">
          ${this.getNotificationIcon(notif.type)}
        </div>
        <div class="notification-content">
          <div class="notification-title">${this.escapeHtml(notif.title)}</div>
          <div class="notification-message">${this.escapeHtml(notif.message)}</div>
          <div class="notification-time">${this.formatTime(notif.created_at)}</div>
          <div class="notification-actions">
            ${!notif.is_read ? `<button class="btn btn-sm btn-outline-primary mark-read-btn">Marcar como lida</button>` : ''}
            ${notif.redirect_url ? `<a href="${notif.redirect_url}" class="btn btn-sm btn-outline-secondary">Ver detalhes</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Add event listeners to new buttons
    panel.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const notifId = btn.closest('.notification-item').dataset.notificationId;
        this.markAsRead(notifId);
      });
    });

    panel.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const redirect = item.querySelector('a[href]');
        if (redirect) {
          window.location.href = redirect.href;
        }
      });
    });
  }

  /**
   * Get HTML for notification icon
   */
  getNotificationIcon(type) {
    const icons = {
      'info': 'ℹ',
      'success': '✓',
      'warning': '⚠',
      'error': '✕',
      'report_ready': '📊',
      'report_error': '⚠',
      'role_changed': '👤',
      'permission_denied': '🔒'
    };
    return icons[type] || 'ℹ';
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/mark_as_read/`, {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (response.ok) {
        // Update local state
        const notif = this.notifications.find(n => n.id == notificationId);
        if (notif) {
          notif.is_read = true;
          this.renderNotifications();
          this.refreshNotificationCount();
        }
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await fetch('/api/notifications/mark_all_read/', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (response.ok) {
        // Update all local notifications
        this.notifications.forEach(notif => notif.is_read = true);
        this.renderNotifications();
        this.refreshNotificationCount();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }

  /**
   * Refresh unread notification count and update badge
   */
  async refreshNotificationCount() {
    try {
      const response = await fetch('/api/notifications/unread_count/', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (response.ok) {
        const data = await response.json();
        this.updateBadge(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Failed to refresh notification count:', error);
    }
  }

  /**
   * Update notification badge with count
   */
  updateBadge(count) {
    const badge = document.getElementById('notificationCount');
    if (!badge) return;

    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }

  /**
   * Set up event listeners for UI elements
   */
  setupEventListeners() {
    const bell = document.getElementById('notificationBell');
    const panel = document.getElementById('notificationPanel');
    const markAllBtn = document.getElementById('markAllRead');

    if (bell && panel) {
      bell.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !bell.contains(e.target)) {
          panel.classList.remove('show');
        }
      });
    }

    if (markAllBtn) {
      markAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.markAllAsRead();
      });
    }

    // Toastr configuration
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
  }

  /**
   * Format time for display (e.g., "5 minutes ago")
   */
  formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize notification manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
  });
} else {
  window.notificationManager = new NotificationManager();
}
