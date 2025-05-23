// 数据分析模块

// 模块定义
const dataAnalysisModule = {
    id: 'module1',
    name: '数据分析模块',
    
    // 初始化模块
    init() {
        console.log('初始化数据分析模块');
        // 注册模块
        window.app.registerModule(this.id, this);
    },
    
    // 激活模块 - 当用户选择此模块时调用
    activate() {
        console.log('激活数据分析模块');
        
        // 获取内容容器
        const container = document.getElementById('moduleContainer');
        
        // 渲染模块UI
        container.innerHTML = `
            <div class="module-header">
                <h3>数据分析工具</h3>
                <p>上传您的数据文件进行分析</p>
            </div>
            
            <div class="file-upload-zone" id="dropZone">
                <p>拖放文件到这里或点击选择文件</p>
                <input type="file" id="fileInput" style="display:none">
                <button class="btn btn-primary" id="selectFileBtn">选择文件</button>
            </div>
            
            <div class="form-group mb-4">
                <label for="analysisType">分析类型</label>
                <select class="form-control" id="analysisType">
                    <option value="type1">基础统计分析</option>
                    <option value="type2">聚类分析</option>
                    <option value="type3">回归分析</option>
                </select>
            </div>
            
            <button class="btn btn-success" id="startAnalysisBtn" disabled>开始分析</button>
            
            <div class="results-container mt-4" id="resultsContainer" style="display:none">
                <h4>分析结果</h4>
                <div id="analysisResults"></div>
                
                <div class="mt-3">
                    <button class="btn btn-outline-primary" id="downloadResultsBtn">
                        下载结果
                    </button>
                </div>
            </div>
        `;
        
        // 设置事件监听
        this.setupEventListeners();
    },
    
    // 模块停用 - 当用户切换到其他模块时调用
    deactivate() {
        console.log('停用数据分析模块');
        // 清理可能的资源
    },
    
    // 设置事件监听
    setupEventListeners() {
        // 文件选择按钮
        document.getElementById('selectFileBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        // 文件输入变化
        document.getElementById('fileInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelected(e.target.files[0]);
            }
        });
        
        // 拖放区域事件
        const dropZone = document.getElementById('dropZone');
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('active');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('active');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelected(e.dataTransfer.files[0]);
            }
        });
        
        // 开始分析按钮
        document.getElementById('startAnalysisBtn').addEventListener('click', () => {
            this.startAnalysis();
        });
        
        // 下载结果按钮
        document.getElementById('downloadResultsBtn').addEventListener('click', () => {
            this.downloadResults();
        });
    },
    
    // 处理选择的文件
    handleFileSelected(file) {
        console.log('已选择文件:', file.name);
        
        // 显示选择的文件名
        const dropZone = document.getElementById('dropZone');
        dropZone.innerHTML = `
            <p>已选择: ${file.name}</p>
            <button class="btn btn-outline-secondary" id="changeFileBtn">更换文件</button>
        `;
        
        // 更换文件按钮
        document.getElementById('changeFileBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        // 保存文件引用
        this.selectedFile = file;
        
        // 启用分析按钮
        document.getElementById('startAnalysisBtn').disabled = false;
    },
    
    // 开始数据分析
    startAnalysis() {
        if (!this.selectedFile) {
            alert('请先选择文件');
            return;
        }
        
        const analysisType = document.getElementById('analysisType').value;
        console.log(`开始分析，类型: ${analysisType}, 文件: ${this.selectedFile.name}`);
        
        // 显示分析进度
        document.getElementById('startAnalysisBtn').disabled = true;
        document.getElementById('startAnalysisBtn').innerHTML = '分析中...';
        
        // 模拟分析过程
        setTimeout(() => {
            this.displayResults({
                success: true,
                summary: '分析完成',
                data: {
                    mean: 45.3,
                    median: 42.1,
                    standardDeviation: 12.8
                }
            });
        }, 2000);
    },
    
    // 显示分析结果
    displayResults(results) {
        document.getElementById('startAnalysisBtn').innerHTML = '开始分析';
        document.getElementById('startAnalysisBtn').disabled = false;
        
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.style.display = 'block';
        
        const analysisResults = document.getElementById('analysisResults');
        
        if (results.success) {
            analysisResults.innerHTML = `
                <div class="alert alert-success">
                    ${results.summary}
                </div>
                <table class="table table-bordered">
                    <tr>
                        <th>指标</th>
                        <th>值</th>
                    </tr>
                    <tr>
                        <td>平均值</td>
                        <td>${results.data.mean}</td>
                    </tr>
                    <tr>
                        <td>中位数</td>
                        <td>${results.data.median}</td>
                    </tr>
                    <tr>
                        <td>标准差</td>
                        <td>${results.data.standardDeviation}</td>
                    </tr>
                </table>
            `;
            
            // 保存结果用于下载
            this.analysisResults = results;
        } else {
            analysisResults.innerHTML = `
                <div class="alert alert-danger">
                    分析失败: ${results.error}
                </div>
            `;
        }
    },
    
    // 下载分析结果
    downloadResults() {
        if (!this.analysisResults) {
            alert('无可下载的分析结果');
            return;
        }
        
        // 创建CSV内容
        const csvContent = [
            '指标,值',
            `平均值,${this.analysisResults.data.mean}`,
            `中位数,${this.analysisResults.data.median}`,
            `标准差,${this.analysisResults.data.standardDeviation}`
        ].join('\n');
        
        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', '分析结果.csv');
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// 导出模块
export default dataAnalysisModule; 