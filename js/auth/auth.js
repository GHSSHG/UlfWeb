// 认证模块
import { getSessionId } from './session.js';

export function initAuth() {
    console.log('初始化认证系统...');
    
    // 检查是否有保存的登录信息
    checkExistingAuth();
    
    // 注册认证模块到全局应用
    window.app.registerModule('auth', authModule);
}

// 检查已有的认证信息
function checkExistingAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // 验证token有效性
        verifyToken(token)
            .then(userData => {
                if (userData) {
                    window.app.setUser(userData);
                    updateUIAfterLogin();
                    console.log('用户已自动登录:', userData.name);
                } else {
                    // token无效，清除存储
                    localStorage.removeItem('authToken');
                }
            });
    } else {
        console.log('用户未登录，使用匿名会话');
    }
}

// 验证token有效性
async function verifyToken(token) {
    try {
        // 实际应用中这里应该调用API验证token
        // 这里简化为从token中解析用户信息
        return { id: '1', name: 'Test User', email: 'test@example.com' };
    } catch (error) {
        console.error('Token验证失败:', error);
        return null;
    }
}

// 登录后更新UI
function updateUIAfterLogin() {
    const user = window.app.getUser();
    if (user) {
        document.getElementById('loginBtn').textContent = user.name;
        document.getElementById('registerBtn').style.display = 'none';
    }
}

// 认证模块接口
const authModule = {
    // 用户登录
    async login(email, password) {
        try {
            // 这里模拟API调用
            console.log(`尝试登录: ${email}`);
            
            // 实际应用中应调用真实API
            const userData = { id: '1', name: 'Test User', email };
            const token = 'sample_token_' + Date.now();
            
            // 存储认证信息
            localStorage.setItem('authToken', token);
            window.app.setUser(userData);
            
            return true;
        } catch (error) {
            console.error('登录失败:', error);
            return false;
        }
    },
    
    // 用户注销
    logout() {
        localStorage.removeItem('authToken');
        window.app.setUser(null);
        document.getElementById('loginBtn').textContent = '登录';
        document.getElementById('registerBtn').style.display = 'inline-block';
        console.log('用户已注销');
    },
    
    // 检查用户是否已登录
    isLoggedIn() {
        return !!window.app.getUser();
    },
    
    // 获取当前用户ID
    getCurrentUserId() {
        const user = window.app.getUser();
        return user ? user.id : null;
    }
}; 