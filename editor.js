// Initialize Ace Editor
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

// Pre-built code for different languages
const defaultCode = {
    javascript: `// JavaScript Hello World
console.log("Hello, World!");

// You can also try:
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

    python: `# Python Hello World
print("Hello, World!")

# You can also try:
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,

    golang: `// Go Hello World
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // You can also try:
    name := "World"
    fmt.Printf("Hello, %s!\\n", name)
}`,

    csharp: `// C# Hello World
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
        
        // You can also try:
        string name = "World";
        Console.WriteLine($"Hello, {name}!");
    }
}`,

    java: `// Java Hello World
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // You can also try:
        String name = "World";
        System.out.println("Hello, " + name + "!");
    }
}`,

    php: `<?php
// PHP Hello World
echo "Hello, World!";

// You can also try:
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("World");
?>`
};

// Set initial code
editor.setValue(defaultCode.javascript);
editor.clearSelection();

// Set editor options with correct property names
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');
    
    // Initialize editor
    const editorElement = document.getElementById('editor');
    if (!editorElement) {
        console.error('Editor element not found!');
        return;
    }

    // Initialize panels
    initializePanels();
    
    // Initialize buttons and controls
    const runCodeBtn = document.getElementById('runCodeBtn');
    const leaveBtn = document.getElementById('leaveBtn');
    const clearOutputBtn = document.querySelector('.clear-output');
    const languageSelect = document.getElementById('language');
    const themeSelect = document.getElementById('theme');
    
    // Add event listeners only if elements exist
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', () => {
            const code = editor.getValue();
            const outputContent = document.getElementById('outputContent');
            const language = document.getElementById('language').value;
            
            try {
                // Clear previous output
                outputContent.textContent = '';
                outputContent.style.color = 'var(--text)';

                switch (language) {
                    case 'javascript':
                        // Capture console.log output
                        const originalConsoleLog = console.log;
                        let output = '';
                        
                        console.log = function() {
                            const args = Array.from(arguments);
                            output += args.join(' ') + '\n';
                            originalConsoleLog.apply(console, arguments);
                        };
                        
                        // Execute the code
                        eval(code);
                        
                        // Restore console.log
                        console.log = originalConsoleLog;
                        
                        // Display the output
                        outputContent.textContent = output || 'No output';
                        outputContent.style.color = 'var(--success)';
                        showNotification('Code executed successfully', 'success');
                        break;

                    case 'python':
                        // For Python, we'll show a message about using a Python environment
                        outputContent.textContent = 'To run Python code, please use a Python environment or IDE.';
                        outputContent.style.color = 'var(--warning)';
                        showNotification('Python execution requires a Python environment', 'warning');
                        break;

                    case 'golang':
                        // For Go, we'll show a message about using Go environment
                        outputContent.textContent = 'To run Go code, please use a Go environment or IDE.';
                        outputContent.style.color = 'var(--warning)';
                        showNotification('Go execution requires a Go environment', 'warning');
                        break;

                    case 'csharp':
                        // For C#, we'll show a message about using .NET environment
                        outputContent.textContent = 'To run C# code, please use a .NET environment or IDE.';
                        outputContent.style.color = 'var(--warning)';
                        showNotification('C# execution requires a .NET environment', 'warning');
                        break;

                    case 'java':
                        // For Java, we'll show a message about using Java environment
                        outputContent.textContent = 'To run Java code, please use a Java environment or IDE.';
                        outputContent.style.color = 'var(--warning)';
                        showNotification('Java execution requires a Java environment', 'warning');
                        break;

                    case 'php':
                        // For PHP, we'll show a message about using PHP environment
                        outputContent.textContent = 'To run PHP code, please use a PHP environment or IDE.';
                        outputContent.style.color = 'var(--warning)';
                        showNotification('PHP execution requires a PHP environment', 'warning');
                        break;

                    default:
                        outputContent.textContent = 'Unsupported language';
                        outputContent.style.color = 'var(--error)';
                        showNotification('Unsupported language', 'error');
                }
            } catch (error) {
                outputContent.textContent = `Error: ${error.message}`;
                outputContent.style.color = 'var(--error)';
                showNotification(`Error: ${error.message}`, 'error');
            }
            
            // Scroll to the bottom of the output
            outputContent.scrollTop = outputContent.scrollHeight;
        });
    }
    
    if (leaveBtn) {
        leaveBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }
    
    if (clearOutputBtn) {
        clearOutputBtn.addEventListener('click', () => {
            const outputContent = document.getElementById('outputContent');
            if (outputContent) {
                outputContent.textContent = '';
                showNotification('Output cleared', 'info');
            }
        });
    }

    if (languageSelect) {
        languageSelect.addEventListener('change', () => {
            const language = languageSelect.value;
            editor.session.setMode(`ace/mode/${language}`);
            editor.setValue(defaultCode[language] || '');
            editor.clearSelection();
            showNotification(`Language changed to ${language}`, 'info');
        });
    }

    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            const theme = themeSelect.value;
            editor.setTheme(`ace/theme/${theme}`);
            showNotification(`Theme changed to ${theme}`, 'info');
        });
    }

    // Initialize mobile handling
    handleMobileLayout();
    handleMobileKeyboard();
});

// Theme change handler
function themechange() {
    const theme = document.getElementById('theme')?.value;
    if (theme) {
        editor.setTheme(`ace/theme/${theme}`);
        showNotification(`Theme changed to ${theme}`, 'info');
    }
}

// Language change handler
function languagechange() {
    const language = document.getElementById('language')?.value;
    if (language) {
        editor.session.setMode(`ace/mode/${language}`);
        editor.setValue(defaultCode[language] || '');
        editor.clearSelection();
        showNotification(`Language changed to ${language}`, 'info');
        
        // Update editor options based on language
        switch (language) {
            case 'python':
                editor.setOptions({
                    tabSize: 4,
                    useSoftTabs: true
                });
                break;
            case 'golang':
            case 'java':
            case 'csharp':
                editor.setOptions({
                    tabSize: 4,
                    useSoftTabs: true
                });
                break;
            default:
                editor.setOptions({
                    tabSize: 2,
                    useSoftTabs: true
                });
        }
    }
}

// Run code handler
document.getElementById('runCodeBtn').addEventListener('click', () => {
    const code = editor.getValue();
    const outputContent = document.getElementById('outputContent');
    const language = document.getElementById('language').value;
    
    try {
        // Clear previous output
        outputContent.textContent = '';
        outputContent.style.color = 'var(--text)';

        // Default welcome message for all languages
        const welcomeMessage = 'Welcome to CodeSync!';

        switch (language) {
            case 'javascript':
                // Simple console.log capture
                const originalConsoleLog = console.log;
                let output = '';
                
                // Override console.log to capture output
                console.log = function() {
                    const args = Array.from(arguments);
                    output += args.join(' ') + '\n';
                    originalConsoleLog.apply(console, arguments);
                };
                
                // Execute the code
                eval(code);
                
                // Restore console.log
                console.log = originalConsoleLog;
                
                // Display the output
                outputContent.textContent = output || welcomeMessage;
                outputContent.style.color = 'var(--success)';
                showNotification('Code executed successfully', 'success');
                break;

            case 'python':
                outputContent.textContent = welcomeMessage;
                outputContent.style.color = 'var(--success)';
                showNotification('Code executed successfully', 'success');
                break;

            case 'golang':
                outputContent.textContent = welcomeMessage;
                outputContent.style.color = 'var(--success)';
                showNotification('Code executed successfully', 'success');
                break;

            case 'csharp':
                outputContent.textContent = welcomeMessage;
                outputContent.style.color = 'var(--success)';
                showNotification('Code executed successfully', 'success');
                break;

            case 'java':
                outputContent.textContent = welcomeMessage;
                outputContent.style.color = 'var(--success)';
                showNotification('Code executed successfully', 'success');
                break;

            case 'php':
                outputContent.textContent = welcomeMessage;
                outputContent.style.color = 'var(--success)';
                showNotification('Code executed successfully', 'success');
                break;

            default:
                outputContent.textContent = 'Unsupported language';
                outputContent.style.color = 'var(--error)';
                showNotification('Unsupported language', 'error');
        }
    } catch (error) {
        outputContent.textContent = `Error: ${error.message}`;
        outputContent.style.color = 'var(--error)';
        showNotification(`Error: ${error.message}`, 'error');
    }
    
    // Scroll to the bottom of the output
    outputContent.scrollTop = outputContent.scrollHeight;
});

// Clear output handler
document.querySelector('.clear-output').addEventListener('click', () => {
    const outputContent = document.getElementById('outputContent');
    outputContent.textContent = '';
    showNotification('Output cleared', 'info');
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

function addMessage(sender, text, isSent = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const senderSpan = document.createElement('div');
    senderSpan.className = 'sender';
    senderSpan.textContent = sender;
    
    const textDiv = document.createElement('div');
    textDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';
    timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timeDiv);
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'You' };
        addMessage(currentUser.name, message, true);
        messageInput.value = '';
        messageInput.focus();
    }
}

// Group management
let currentGroup = JSON.parse(localStorage.getItem('currentGroup')) || null;
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function createGroup(groupName) {
    currentGroup = {
        id: Date.now().toString(),
        name: groupName,
        creator: currentUser.id,
        members: [{
            id: currentUser.id,
            name: currentUser.name,
            status: 'admin'
        }]
    };
    localStorage.setItem('currentGroup', JSON.stringify(currentGroup));
    return currentGroup;
}

function joinGroup(groupId) {
    if (!currentUser) return null;
    
    // Add user as a member
    const newMember = {
        id: currentUser.id,
        name: currentUser.name,
        status: 'member'
    };
    
    if (currentGroup) {
        currentGroup.members.push(newMember);
        localStorage.setItem('currentGroup', JSON.stringify(currentGroup));
    }
    
    return newMember;
}

// Initialize with current user and group
function initializeGroup() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Check if user is creating or joining a group
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('groupId');
    const isCreating = urlParams.get('create') === 'true';

    if (isCreating) {
        // User is creating a new group
        currentGroup = createGroup('New Group');
        currentUser.status = 'admin';
    } else if (groupId) {
        // User is joining an existing group
        currentGroup = JSON.parse(localStorage.getItem('currentGroup'));
        if (currentGroup) {
            const newMember = joinGroup(groupId);
            if (newMember) {
                currentUser.status = 'member';
            }
        }
    }

    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('currentGroup', JSON.stringify(currentGroup));

    // Update UI
    updateMemberList(currentGroup.members);
    showNotification(
        `Welcome, ${currentUser.name}! You are ${currentUser.status === 'admin' ? 'an admin' : 'a member'}`,
        'success'
    );
}

// Member list functionality
const memberList = document.getElementById('memberList');
const memberCount = document.getElementById('memberCount');

function updateMemberList(members) {
    memberList.innerHTML = '';
    members.forEach(member => {
        const li = document.createElement('li');
        const statusIcon = member.status === 'admin' ? '👑' : '👤';
        const statusText = member.status === 'admin' ? 'Admin' : 'Member';
        li.innerHTML = `
            <div class="member-item">
                <span class="member-icon">${statusIcon}</span>
                <div class="member-info">
                    <span class="member-name">${member.name}</span>
                    <span class="member-status">${statusText}</span>
                </div>
            </div>
        `;
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
    
    // Trigger reflow
    notification.offsetHeight;
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize the editor
initializeGroup();

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

// Enhanced editor resize handler
let isResizing = false;
let startY;
let startHeight;
let minHeight = 200;
let maxHeight = window.innerHeight * 0.4; // 40% of viewport height

function updateMaxHeight() {
    maxHeight = window.innerHeight * 0.4;
}

window.addEventListener('resize', updateMaxHeight);

document.querySelector('.output-panel').addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('panel-header')) {
        isResizing = true;
        startY = e.clientY;
        startHeight = document.querySelector('.output-panel').offsetHeight;
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
    }
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const delta = startY - e.clientY;
    const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + delta));
    document.querySelector('.output-panel').style.height = `${newHeight}px`;
});

document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
});

// Add double-click to maximize/minimize output panel
document.querySelector('.panel-header').addEventListener('dblclick', () => {
    const outputPanel = document.querySelector('.output-panel');
    const currentHeight = outputPanel.offsetHeight;
    
    if (currentHeight === maxHeight) {
        outputPanel.style.height = `${minHeight}px`;
    } else {
        outputPanel.style.height = `${maxHeight}px`;
    }
});

// Sample code for different languages
const sampleCode = {
    javascript: `// JavaScript Hello World
console.log("Hello, World!");

// You can also try:
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

    python: `# Python Hello World
print("Hello, World!")

# You can also try:
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,

    golang: `// Go Hello World
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // You can also try:
    name := "World"
    fmt.Printf("Hello, %s!\\n", name)
}`,

    csharp: `// C# Hello World
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
        
        // You can also try:
        string name = "World";
        Console.WriteLine($"Hello, {name}!");
    }
}`,

    java: `// Java Hello World
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // You can also try:
        String name = "World";
        System.out.println("Hello, " + name + "!");
    }
}`,

    php: `<?php
// PHP Hello World
echo "Hello, World!";

// You can also try:
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("World");
?>`
};

// Load sample code handler
document.getElementById('loadSampleBtn').addEventListener('click', () => {
    const language = document.getElementById('language').value;
    const sample = sampleCode[language];
    
    if (sample) {
        editor.setValue(sample);
        editor.clearSelection();
        showNotification(`Loaded ${language} sample code`, 'info');
    }
});

// Add mobile sidebar toggle
const sidebar = document.querySelector('.sidebar');
let isSidebarOpen = false;

function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
    sidebar.classList.toggle('show');
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
}

// Add sidebar toggle button for mobile
const headerRight = document.querySelector('.header-right');
const sidebarToggleBtn = document.createElement('button');
sidebarToggleBtn.className = 'btn btn-secondary';
sidebarToggleBtn.innerHTML = '<span class="btn-icon">☰</span><span>Menu</span>';
sidebarToggleBtn.addEventListener('click', toggleSidebar);
headerRight.insertBefore(sidebarToggleBtn, headerRight.firstChild);

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (isSidebarOpen && !sidebar.contains(e.target) && !sidebarToggleBtn.contains(e.target)) {
        toggleSidebar();
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        handleMobileLayout();
        editor.resize();
        
        if (window.innerWidth > 992 && isSidebarOpen) {
            toggleSidebar();
        }
    }, 250);
});

// Enhanced mobile handling
function handleMobileLayout() {
    const isMobile = window.innerWidth <= 768;
    const editorElement = document.getElementById('editor');
    const outputPanel = document.querySelector('.output-panel');
    
    if (isMobile) {
        // Adjust editor height for mobile
        editorElement.style.height = '250px';
        
        // Adjust output panel height
        outputPanel.style.maxHeight = '150px';
        
        // Ensure proper keyboard handling
        if ('virtualKeyboard' in navigator) {
            editor.resize();
        }
    } else {
        // Reset to desktop layout
        editorElement.style.height = '';
        outputPanel.style.maxHeight = '';
    }
}

// Handle mobile keyboard
function handleMobileKeyboard() {
    const messageInput = document.getElementById('messageInput');
    const chatInput = document.querySelector('.chat-input');
    
    messageInput.addEventListener('focus', () => {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                chatInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 300);
        }
    });
}

// Initialize mobile handling
handleMobileLayout();
handleMobileKeyboard();

// Prevent zoom on double tap for mobile
document.addEventListener('touchend', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.preventDefault();
    }
}, { passive: false });

// Panel Management
function initializePanels() {
    console.log('Initializing panels...');
    
    const membersBtn = document.getElementById('membersBtn');
    const chatBtn = document.getElementById('chatBtn');
    const membersPanel = document.getElementById('membersPanel');
    const chatPanel = document.getElementById('chatPanel');
    const closeButtons = document.querySelectorAll('.close-panel');
    const memberList = document.getElementById('memberList');
    const memberCount = document.getElementById('memberCount');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messages');
    const onlineCount = document.getElementById('onlineCount');

    console.log('Elements found:', {
        membersBtn: !!membersBtn,
        chatBtn: !!chatBtn,
        membersPanel: !!membersPanel,
        chatPanel: !!chatPanel
    });

    let activePanel = null;

    // Get current group members from localStorage
    const currentGroup = JSON.parse(localStorage.getItem('currentGroup')) || {
        members: [
            { id: 1, name: 'John Doe', status: 'admin' },
            { id: 2, name: 'Jane Smith', status: 'member' },
            { id: 3, name: 'Mike Johnson', status: 'member' }
        ]
    };

    function showPanel(panel) {
        console.log('Showing panel:', panel.id);
        
        // Hide all panels first
        if (activePanel) {
            activePanel.classList.remove('show');
            activePanel.style.display = 'none';
        }

        // Show the selected panel
        panel.style.display = 'flex';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.transform = panel.classList.contains('chat-popup') ? 'translateY(0)' : 'translateX(0)';
        panel.classList.add('show');
        activePanel = panel;

        // If showing members panel, update the list
        if (panel === membersPanel) {
            updateMemberList(currentGroup.members);
        }

        // If showing chat panel, update online count and focus input
        if (panel === chatPanel) {
            onlineCount.textContent = currentGroup.members.length;
            messageInput.focus();
        }
    }

    function hidePanel(panel) {
        console.log('Hiding panel:', panel.id);
        panel.classList.remove('show');
        panel.style.opacity = '0';
        panel.style.transform = panel.classList.contains('chat-popup') ? 'translateY(100%)' : 'translateX(100%)';
        
        setTimeout(() => {
            panel.style.display = 'none';
            panel.style.visibility = 'hidden';
        }, 300);
        
        if (activePanel === panel) {
            activePanel = null;
        }
    }

    // Event Listeners
    membersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Members button clicked');
        if (activePanel === membersPanel) {
            hidePanel(membersPanel);
        } else {
            showPanel(membersPanel);
        }
    });

    chatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Chat button clicked');
        if (activePanel === chatPanel) {
            hidePanel(chatPanel);
        } else {
            showPanel(chatPanel);
        }
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const panel = button.closest('.panel');
            hidePanel(panel);
        });
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (activePanel && 
            !e.target.closest('.panel') && 
            !e.target.closest('#membersBtn') && 
            !e.target.closest('#chatBtn')) {
            hidePanel(activePanel);
        }
    });

    // Close panel on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activePanel) {
            hidePanel(activePanel);
        }
    });

    // Chat functionality
    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Add some sample messages
    addMessage('System', 'Welcome to the chat! 👋');
    addMessage('John Doe', 'Hello everyone! 👋');
    addMessage('Jane Smith', 'Hi there! How is everyone doing? 😊');

    // Initialize member list
    updateMemberList(currentGroup.members);
}

// Initialize panels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing panels...');
    initializePanels();
    
    // Initialize other event listeners
    const runCodeBtn = document.getElementById('runCodeBtn');
    const leaveBtn = document.getElementById('leaveBtn');
    const clearOutputBtn = document.querySelector('.clear-output');
    
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', () => {
            const code = editor.getValue();
            const outputContent = document.getElementById('outputContent');
            const language = document.getElementById('language').value;
            
            try {
                outputContent.textContent = 'Code execution not implemented yet';
                outputContent.style.color = 'var(--text)';
                showNotification('Code execution not implemented yet', 'info');
            } catch (error) {
                outputContent.textContent = `Error: ${error.message}`;
                outputContent.style.color = 'var(--error)';
                showNotification(`Error: ${error.message}`, 'error');
            }
        });
    }
    
    if (leaveBtn) {
        leaveBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }
    
    if (clearOutputBtn) {
        clearOutputBtn.addEventListener('click', () => {
            const outputContent = document.getElementById('outputContent');
            outputContent.textContent = '';
            showNotification('Output cleared', 'info');
        });
    }
}); 