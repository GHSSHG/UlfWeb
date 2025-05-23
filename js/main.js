// 主应用入口
import { initSession, getSessionId, clearSession } from './storage/session.js';
import { loadModules } from './modules/moduleLoader.js';

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('应用初始化中...');
    
    // 初始化会话管理
    const sessionId = initSession();
    document.getElementById('sessionIdDisplay').textContent = sessionId.substring(0, 8);
    
    // 加载功能模块
    loadModules();
    
    // 设置事件监听
    setupEventListeners();
    
    console.log('应用初始化完成');
});

// 设置全局事件监听
function setupEventListeners() {
    // 关于链接点击事件
    document.getElementById('aboutLink').addEventListener('click', (e) => {
        e.preventDefault();
        const aboutModal = new bootstrap.Modal(document.getElementById('aboutModal'));
        aboutModal.show();
    });
    
    // 清除会话按钮
    document.getElementById('clearSessionBtn').addEventListener('click', () => {
        if (confirm('确定要清除所有本地数据吗？这将删除您的分析历史和结果。')) {
            clearSession();
            location.reload(); // 刷新页面
        }
    });
}

// 全局应用命名空间
window.app = {
    modules: {},
    currentModule: null,
    results: {},
    
    // 注册新模块
    registerModule(name, moduleObject) {
        this.modules[name] = moduleObject;
        console.log(`模块 ${name} 已注册`);
    },
    
    // 获取模块
    getModule(name) {
        return this.modules[name];
    },
    
    // 激活模块
    activateModule(name) {
        if (this.modules[name]) {
            if (this.currentModule) {
                this.currentModule.deactivate();
            }
            this.currentModule = this.modules[name];
            this.currentModule.activate();
            console.log(`模块 ${name} 已激活`);
            return true;
        }
        return false;
    },
    
    // 保存分析结果
    saveResult(moduleId, resultData) {
        if (!this.results[moduleId]) {
            this.results[moduleId] = [];
        }
        
        // 创建结果对象，包含时间戳
        const result = {
            id: `result_${Date.now()}`,
            timestamp: new Date().toISOString(),
            data: resultData
        };
        
        this.results[moduleId].push(result);
        
        // 存储到本地存储
        try {
            localStorage.setItem(`results_${moduleId}`, JSON.stringify(this.results[moduleId]));
        } catch (e) {
            console.warn('无法保存结果到本地存储', e);
        }
        
        return result.id;
    },
    
    // 获取特定模块的所有结果
    getResults(moduleId) {
        // 从本地存储加载
        try {
            const storedResults = localStorage.getItem(`results_${moduleId}`);
            if (storedResults) {
                this.results[moduleId] = JSON.parse(storedResults);
            }
        } catch (e) {
            console.warn('无法从本地存储加载结果', e);
        }
        
        return this.results[moduleId] || [];
    },
    
    // 获取特定结果
    getResult(moduleId, resultId) {
        const results = this.getResults(moduleId);
        return results.find(r => r.id === resultId);
    },
    
    // 显示处理中对话框
    showProcessing(message = '正在处理您的数据，请稍候...') {
        document.getElementById('processingMessage').textContent = message;
        document.getElementById('progressBar').style.width = '0%';
        const modal = new bootstrap.Modal(document.getElementById('processingModal'));
        modal.show();
        return modal;
    },
    
    // 更新进度条
    updateProgress(percent) {
        document.getElementById('progressBar').style.width = `${percent}%`;
    },
    
    // 隐藏处理中对话框
    hideProcessing() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('processingModal'));
        if (modal) {
            modal.hide();
        }
    }
}; 