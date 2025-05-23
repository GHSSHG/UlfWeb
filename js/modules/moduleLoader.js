// 模块加载器

// 定义可用模块列表
const availableModules = [
    {
        id: 'mhc-peptide',
        name: 'MHC和Peptide二元结合',
        description: '分析MHC与Peptide的相互作用和结合亲和力',
        icon: 'bi-link-45deg',
        path: './modules/mhcPeptide/index.js'
    },
    {
        id: 'mhc-peptide-tcr',
        name: 'MHC-Peptide-TCR三元结合',
        description: '分析MHC-Peptide-TCR三元复合物的相互作用',
        icon: 'bi-diagram-3',
        path: './modules/mhcPeptideTcr/index.js'
    },
    {
        id: 'tcr-mhc-peptide',
        name: 'TCR和MHC预测Peptide',
        description: '根据TCR和MHC预测可能结合的Peptide序列',
        icon: 'bi-search',
        path: './modules/tcrMhcPeptide/index.js'
    }
];

// 加载所有模块
export async function loadModules() {
    console.log('加载功能模块列表...');
    
    // 获取模块列表容器
    const modulesList = document.getElementById('modulesList');
    modulesList.innerHTML = '';
    
    // 创建并添加模块链接
    availableModules.forEach(module => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = '#';
        link.dataset.moduleId = module.id;
        link.innerHTML = `<i class="${module.icon} me-2"></i> ${module.name}`;
        
        // 点击事件 - 激活模块
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除其他活动链接的激活状态
            document.querySelectorAll('#modulesList .nav-link').forEach(el => {
                el.classList.remove('active');
            });
            
            // 激活当前链接
            link.classList.add('active');
            
            // 加载并激活模块
            loadAndActivateModule(module);
        });
        
        li.appendChild(link);
        modulesList.appendChild(li);
    });
    
    console.log(`已加载 ${availableModules.length} 个模块`);
}

// 加载并激活指定模块
async function loadAndActivateModule(moduleInfo) {
    console.log(`加载模块: ${moduleInfo.name}`);
    
    // 如果模块已加载，直接激活
    if (window.app.modules[moduleInfo.id]) {
        window.app.activateModule(moduleInfo.id);
        return;
    }
    
    try {
        // 动态导入模块
        const moduleModule = await import(moduleInfo.path);
        
        // 初始化模块
        if (moduleModule.default && typeof moduleModule.default.init === 'function') {
            moduleModule.default.init();
            console.log(`模块 ${moduleInfo.id} 初始化成功`);
            
            // 激活模块
            window.app.activateModule(moduleInfo.id);
        } else {
            console.error(`模块 ${moduleInfo.id} 缺少有效的初始化方法`);
        }
    } catch (error) {
        console.error(`加载模块 ${moduleInfo.id} 失败:`, error);
        
        // 显示错误消息
        const container = document.getElementById('moduleContainer');
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4>模块加载失败</h4>
                <p>无法加载 ${moduleInfo.name} 模块。错误信息:</p>
                <pre>${error.message}</pre>
            </div>
        `;
    }
}

// 获取模块元数据
export function getModuleMetadata(moduleId) {
    return availableModules.find(m => m.id === moduleId);
} 