// Initialize Ace Editor
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.setOptions({
    fontSize: "14px",
    fontFamily: "'JetBrains Mono', monospace",
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    showLineNumbers: true,
    showGutter: true,
    highlightActiveLine: true,
    highlightSelectedWord: true,
    showPrintMargin: false,
    scrollPastEnd: 0.5,
    behavioursEnabled: true,
    wrapBehavioursEnabled: true,
    autoScrollEditorIntoView: true
});

// Theme change handler
function themechange() {
    const theme = document.getElementById('theme').value;
    editor.setTheme(`ace/theme/${theme}`);
    showNotification(`Theme changed to ${theme}`);
}

// Language change handler
function languagechange() {
    const language = document.getElementById('language').value;
    editor.session.setMode(`ace/mode/${language}`);
    showNotification(`Language changed to ${language}`);
}

// Run code handler
document.getElementById('runCodeBtn').addEventListener('click', () => {
    const code = editor.getValue();
    const outputContent = document.getElementById('outputContent');
    const language = document.getElementById('language').value;
    
    try {
        if (language === 'javascript') {
            const result = eval(code);
            outputContent.textContent = result !== undefined ? result : 'Code executed successfully';
            outputContent.style.color = 'var(--success)';
        } else {
            outputContent.textContent = 'Code execution is only supported for JavaScript in this demo';
            outputContent.style.color = 'var(--warning)';
        }
    } catch (error) {
        outputContent.textContent = `Error: ${error.message}`;
        outputContent.style.color = 'var(--error)';
    }
});

// Leave button handler
document.getElementById('leaveBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});

// Chat functionality
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const senderSpan = document.createElement('div');
    senderSpan.className = 'sender';
    senderSpan.textContent = sender;
    
    const textDiv = document.createElement('div');
    textDiv.textContent = text;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(textDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        addMessage(currentUser.name, message);
        messageInput.value = '';
        messageInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Member list functionality
const memberList = document.getElementById('memberList');
const memberCount = document.getElementById('memberCount');

function updateMemberList(members) {
    memberList.innerHTML = '';
    members.forEach(member => {
        const li = document.createElement('li');
        const statusIcon = member.status === 'royal' ? '👑' : '👤';
        li.innerHTML = `${statusIcon} ${member.name} <span class="status">(${member.status})</span>`;
        memberList.appendChild(li);
    });
    memberCount.textContent = members.length;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize with current user
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) {
    updateMemberList([currentUser]);
    showNotification(`Welcome, ${currentUser.name}!`, 'success');
} else {
    window.location.href = 'index.html';
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('runCodeBtn').click();
    }
    
    // Ctrl/Cmd + S to save (placeholder for future implementation)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showNotification('Save functionality coming soon!', 'info');
    }
}); 