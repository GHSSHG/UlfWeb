// 会话管理模块

// 生成唯一会话ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

// 初始化会话
export function initSession() {
    let sessionId = localStorage.getItem('sessionId');
    
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('sessionId', sessionId);
        console.log('创建新会话:', sessionId);
    } else {
        console.log('恢复已有会话:', sessionId);
    }
    
    // 记录会话开始时间
    localStorage.setItem('sessionStart', Date.now());
    
    // 设置会话心跳
    setInterval(updateSessionHeartbeat, 60000);
    
    return sessionId;
}

// 获取当前会话ID
export function getSessionId() {
    return localStorage.getItem('sessionId');
}

// 更新会话心跳
function updateSessionHeartbeat() {
    localStorage.setItem('sessionLastActive', Date.now());
}

// 保存会话关联数据
export function saveSessionData(key, value) {
    const sessionPrefix = `session_${getSessionId()}_`;
    localStorage.setItem(sessionPrefix + key, JSON.stringify(value));
}

// 获取会话关联数据
export function getSessionData(key) {
    const sessionPrefix = `session_${getSessionId()}_`;
    const data = localStorage.getItem(sessionPrefix + key);
    return data ? JSON.parse(data) : null;
}

// 清除会话数据
export function clearSession() {
    const sessionId = getSessionId();
    
    // 查找和当前会话相关的所有存储项
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes(`session_${sessionId}_`) || key.startsWith('results_'))) {
            keysToRemove.push(key);
        }
    }
    
    // 删除找到的键
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // 重置会话ID
    localStorage.removeItem('sessionId');
    localStorage.removeItem('sessionStart');
    localStorage.removeItem('sessionLastActive');
    
    console.log('会话已清除');
} 