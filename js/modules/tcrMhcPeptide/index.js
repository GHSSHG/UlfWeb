// TCR和MHC预测Peptide模块

// 导入工具函数
import { parseFile, downloadData } from '../utils.js';

// 模块定义
const tcrMhcPeptideModule = {
    id: 'tcr-mhc-peptide',
    name: 'TCR和MHC预测Peptide',
    
    // 初始化模块
    init() {
        console.log('初始化TCR-MHC-Peptide模块');
        window.app.registerModule(this.id, this);
    },
    
    // 激活模块
    activate() {
        console.log('激活TCR-MHC-Peptide模块');
        
        const container = document.getElementById('moduleContainer');
        
        // 渲染模块UI
        container.innerHTML = `
            <div class="module-header">
                <h3>TCR和MHC预测Peptide</h3>
                <p>基于TCR和MHC预测可能结合的Peptide序列</p>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>TCR信息</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">输入方式</label>
                                <select class="form-select" id="tcrInputType">
                                    <option value="text">直接输入序列</option>
                                    <option value="file">上传文件</option>
                                </select>
                            </div>
                            
                            <div id="tcrTextInput" class="mb-3">
                                <label class="form-label">TCR α链CDR3</label>
                                <input type="text" class="form-control mb-2" id="tcrAlpha" placeholder="α链CDR3序列（可选）">
                                <label class="form-label">TCR β链CDR3 <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="tcrBeta" placeholder="β链CDR3序列（必填）">
                            </div>
                            
                            <div id="tcrFileInput" class="mb-3" style="display:none">
                                <label class="form-label">上传TCR文件</label>
                                <div class="file-upload-zone" id="tcrDropZone">
                                    <p>拖放文件到这里或点击选择文件</p>
                                    <input type="file" id="tcrFile" style="display:none" accept=".fasta,.txt,.csv">
                                    <button class="btn btn-outline-primary btn-sm" id="selectTcrFileBtn">选择文件</button>
                                </div>
                                <div class="form-text">支持FASTA, TXT或CSV格式</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>MHC信息</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">MHC类型</label>
                                <select class="form-select" id="mhcType">
                                    <option value="I">MHC I类</option>
                                    <option value="II">MHC II类</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">MHC等位基因</label>
                                <select class="form-select" id="mhcAllele">
                                    <option value="HLA-A*02:01">HLA-A*02:01</option>
                                    <option value="HLA-A*01:01">HLA-A*01:01</option>
                                    <option value="HLA-B*07:02">HLA-B*07:02</option>
                                    <option value="HLA-B*08:01">HLA-B*08:01</option>
                                </select>
                            </div>
                            
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="useMultipleMhc">
                                <label class="form-check-label" for="useMultipleMhc">使用多个MHC等位基因</label>
                            </div>
                            
                            <div id="multipleMhcSelect" style="display:none">
                                <label class="form-label">选择多个MHC等位基因</label>
                                <select class="form-select" id="mhcAlleleMultiple" multiple size="4">
                                    <option value="HLA-A*02:01">HLA-A*02:01</option>
                                    <option value="HLA-A*01:01">HLA-A*01:01</option>
                                    <option value="HLA-B*07:02">HLA-B*07:02</option>
                                    <option value="HLA-B*08:01">HLA-B*08:01</option>
                                    <option value="HLA-B*44:02">HLA-B*44:02</option>
                                    <option value="HLA-C*07:01">HLA-C*07:01</option>
                                </select>
                                <div class="form-text">按住Ctrl键可选择多个</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5>预测参数</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label class="form-label">预测方法</label>
                                        <select class="form-select" id="predictionMethod">
                                            <option value="ai">AI深度学习</option>
                                            <option value="motif">基于模式识别</option>
                                            <option value="structure">结构预测</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label class="form-label">肽段长度</label>
                                        <select class="form-select" id="peptideLength">
                                            <option value="8,9,10">8-10（推荐）</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label class="form-label">返回结果数量</label>
                                        <input type="number" class="form-control" id="resultCount" min="1" max="100" value="10">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="filterByBinding" checked>
                                        <label class="form-check-label" for="filterByBinding">
                                            根据MHC结合力过滤结果
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-5">
                <button class="btn btn-primary btn-lg" id="startPredictionBtn">开始预测</button>
            </div>
            
            <div class="results-container mt-4" id="resultsContainer" style="display:none">
                <h4>预测结果</h4>
                <div class="alert alert-info">
                    <strong>预测完成。</strong> <span id="resultSummary"></span>
                </div>
                
                <ul class="nav nav-tabs" id="resultTabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#peptideListTab">预测肽段</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#motifTab">序列模式</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#detailedInfoTab">详细信息</a>
                    </li>
                </ul>
                
                <div class="tab-content mt-3">
                    <div class="tab-pane fade show active" id="peptideListTab">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered" id="peptideTable">
                                <thead>
                                    <tr>
                                        <th>排名</th>
                                        <th>肽段序列</th>
                                        <th>预测得分</th>
                                        <th>MHC结合预测</th>
                                        <th>置信度</th>
                                    </tr>
                                </thead>
                                <tbody id="peptideTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="motifTab">
                        <div class="row">
                            <div class="col-md-8 offset-md-2">
                                <h5 class="text-center mb-3">识别的肽段序列模式</h5>
                                <div id="sequenceLogoContainer" style="height: 200px;"></div>
                                <p class="text-center text-muted">序列标志图显示TCR倾向于识别的肽段模式</p>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="detailedInfoTab">
                        <div id="detailedInfoContent">
                            <div class="card">
                                <div class="card-header">
                                    <h5>预测细节</h5>
                                </div>
                                <div class="card-body">
                                    <p>本预测基于TCR序列特征和MHC约束条件，使用深度学习模型计算可能的肽段序列。</p>
                                    <p>模型置信度取决于训练数据中与输入TCR的相似性以及MHC等位基因数据的丰富程度。</p>
                                    <p>请注意，预测结果仅供参考，实际结合情况可能受多种因素影响。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <button class="btn btn-success" id="downloadResultsBtn">
                        <i class="bi bi-download"></i> 下载结果
                    </button>
                </div>
            </div>
            
            <div id="previousResults"></div>
        `;
        
        // 设置事件监听
        this.setupEventListeners();
    },
    
    // 模块停用
    deactivate() {
        console.log('停用TCR-MHC-Peptide模块');
    },
    
    // 设置事件监听
    setupEventListeners() {
        // TCR输入类型切换
        document.getElementById('tcrInputType').addEventListener('change', (e) => {
            const inputType = e.target.value;
            document.getElementById('tcrTextInput').style.display = inputType === 'text' ? 'block' : 'none';
            document.getElementById('tcrFileInput').style.display = inputType === 'file' ? 'block' : 'none';
        });
        
        // 文件选择按钮
        document.getElementById('selectTcrFileBtn').addEventListener('click', () => {
            document.getElementById('tcrFile').click();
        });
        
        // 文件上传处理
        document.getElementById('tcrFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelected(e.target.files[0]);
            }
        });
        
        // 文件拖放区域事件
        const dropZone = document.getElementById('tcrDropZone');
        
        ['dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (eventName === 'dragover') {
                    dropZone.classList.add('active');
                } else if (eventName === 'dragleave') {
                    dropZone.classList.remove('active');
                } else if (eventName === 'drop') {
                    dropZone.classList.remove('active');
                    if (e.dataTransfer.files.length > 0) {
                        this.handleFileSelected(e.dataTransfer.files[0]);
                    }
                }
            });
        });
        
        // MHC类型变更时更新等位基因列表
        document.getElementById('mhcType').addEventListener('change', () => {
            this.updateMhcAlleleOptions();
        });
        
        // 多个MHC选项切换
        document.getElementById('useMultipleMhc').addEventListener('change', (e) => {
            const useMultiple = e.target.checked;
            document.getElementById('mhcAllele').style.display = useMultiple ? 'none' : 'block';
            document.getElementById('multipleMhcSelect').style.display = useMultiple ? 'block' : 'none';
        });
        
        // 开始预测按钮
        document.getElementById('startPredictionBtn').addEventListener('click', () => {
            this.startPrediction();
        });
        
        // 下载结果按钮
        document.getElementById('downloadResultsBtn').addEventListener('click', () => {
            this.downloadResults();
        });
    },
    
    // 处理所选文件
    handleFileSelected(file) {
        // 处理上传文件的逻辑
        document.getElementById('tcrDropZone').innerHTML = `
            <p>已选择: ${file.name}</p>
            <button class="btn btn-outline-secondary btn-sm" id="changeTcrFileBtn">更换文件</button>
        `;
        
        document.getElementById('changeTcrFileBtn').addEventListener('click', () => {
            document.getElementById('tcrFile').click();
        });
        
        // 存储文件引用
        this.tcrFile = file;
    },
    
    // 更新MHC等位基因选项
    updateMhcAlleleOptions() {
        // 根据MHC类型更新等位基因下拉列表
        const mhcType = document.getElementById('mhcType').value;
        const singleSelect = document.getElementById('mhcAllele');
        const multiSelect = document.getElementById('mhcAlleleMultiple');
        
        // 清除现有选项
        singleSelect.innerHTML = '';
        multiSelect.innerHTML = '';
        
        // 添加新选项
        const alleles = mhcType === 'I' 
            ? ['HLA-A*02:01', 'HLA-A*01:01', 'HLA-B*07:02', 'HLA-B*08:01', 'HLA-C*07:01', 'HLA-B*44:02'] 
            : ['HLA-DRB1*01:01', 'HLA-DRB1*03:01', 'HLA-DRB1*04:01', 'HLA-DQA1*01:01/DQB1*05:01'];
            
        alleles.forEach(allele => {
            // 添加到单选下拉列表
            const option1 = document.createElement('option');
            option1.value = allele;
            option1.textContent = allele;
            singleSelect.appendChild(option1);
            
            // 添加到多选下拉列表
            const option2 = document.createElement('option');
            option2.value = allele;
            option2.textContent = allele;
            multiSelect.appendChild(option2);
        });
    },
    
    // 验证输入
    validateInput() {
        // TCR输入验证
        const tcrInputType = document.getElementById('tcrInputType').value;
        
        if (tcrInputType === 'text') {
            const tcrBeta = document.getElementById('tcrBeta').value.trim();
            if (!tcrBeta) {
                alert('请输入TCR β链CDR3序列');
                return false;
            }
        } else if (!this.tcrFile) {
            alert('请上传TCR文件');
            return false;
        }
        
        // MHC输入验证
        const useMultipleMhc = document.getElementById('useMultipleMhc').checked;
        if (useMultipleMhc) {
            const selectedOptions = Array.from(document.getElementById('mhcAlleleMultiple').selectedOptions);
            if (selectedOptions.length === 0) {
                alert('请至少选择一个MHC等位基因');
                return false;
            }
        }
        
        return true;
    },
    
    // 收集预测参数
    collectPredictionParameters() {
        const params = {
            predictionMethod: document.getElementById('predictionMethod').value,
            peptideLength: document.getElementById('peptideLength').value,
            resultCount: document.getElementById('resultCount').value,
            filterByBinding: document.getElementById('filterByBinding').checked,
            mhcType: document.getElementById('mhcType').value
        };
        
        // 收集TCR序列信息
        const tcrInputType = document.getElementById('tcrInputType').value;
        if (tcrInputType === 'text') {
            params.tcrAlpha = document.getElementById('tcrAlpha').value.trim();
            params.tcrBeta = document.getElementById('tcrBeta').value.trim();
        } else {
            params.tcrFile = this.tcrFile;
        }
        
        // 收集MHC信息
        const useMultipleMhc = document.getElementById('useMultipleMhc').checked;
        if (useMultipleMhc) {
            params.mhcAlleles = Array.from(document.getElementById('mhcAlleleMultiple').selectedOptions).map(o => o.value);
        } else {
            params.mhcAllele = document.getElementById('mhcAllele').value;
        }
        
        return params;
    },
    
    // 开始预测
    async startPrediction() {
        // 验证输入
        if (!this.validateInput()) {
            return;
        }
        
        // 显示处理对话框
        const modal = window.app.showProcessing('正在预测潜在的肽段序列...');
        
        try {
            // 收集参数
            const params = this.collectPredictionParameters();
            
            // 模拟预测过程
            await this.simulatePredictionProcess();
            
            // 生成模拟预测结果
            const results = this.generateMockResults(params);
            
            // 保存结果
            window.app.saveResult(this.id, {
                ...params,
                results,
                timestamp: new Date().toISOString()
            });
            
            // 显示结果
            this.displayResults(results);
            
        } catch (error) {
            console.error('预测过程中出错:', error);
            alert('预测过程中发生错误: ' + error.message);
        } finally {
            // 隐藏处理对话框
            window.app.hideProcessing();
        }
    },
    
    // 模拟预测过程
    async simulatePredictionProcess() {
        // 模拟预测过程的步骤
        const steps = [
            '分析TCR序列特征...',
            '加载MHC结合模型...',
            '生成候选肽段...',
            '评估TCR-pMHC结合可能性...',
            '排序结果...'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            const progress = Math.round((i / steps.length) * 100);
            window.app.updateProgress(progress);
            document.getElementById('processingMessage').textContent = steps[i];
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        window.app.updateProgress(100);
    },
    
    // 生成模拟预测结果
    generateMockResults(params) {
        // 生成示例预测结果
        const peptideCount = parseInt(params.resultCount) || 10;
        const results = [];
        
        // 示例氨基酸
        const aminoAcids = ['A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V'];
        
        // 确定肽段长度
        let peptideLengths = params.peptideLength.split(',').map(Number);
        if (peptideLengths.includes(NaN)) {
            peptideLengths = [9]; // 默认长度为9
        }
        
        // 生成随机肽段
        for (let i = 0; i < peptideCount; i++) {
            // 随机选择一个长度
            const length = peptideLengths[Math.floor(Math.random() * peptideLengths.length)];
            
            // 生成序列
            let sequence = '';
            for (let j = 0; j < length; j++) {
                sequence += aminoAcids[Math.floor(Math.random() * aminoAcids.length)];
            }
            
            // 生成预测得分和置信度
            const score = (1 - i * 0.08).toFixed(2);
            const bindingScore = Math.random() < 0.7 ? '强结合' : (Math.random() < 0.5 ? '中等结合' : '弱结合');
            const confidence = (Math.random() * 0.3 + 0.7 - i * 0.05).toFixed(2);
            
            results.push({
                rank: i + 1,
                sequence,
                score,
                binding: bindingScore,
                confidence
            });
        }
        
        return results;
    },
    
    // 显示预测结果
    displayResults(results) {
        // 显示结果容器
        document.getElementById('resultsContainer').style.display = 'block';
        document.getElementById('resultSummary').textContent = `已生成 ${results.length} 个可能的肽段序列。`;
        
        // 填充结果表格
        const tableBody = document.getElementById('peptideTableBody');
        tableBody.innerHTML = '';
        
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.rank}</td>
                <td>${result.sequence}</td>
                <td>${result.score}</td>
                <td>${result.binding}</td>
                <td>${result.confidence}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // 在模式标签页显示示例图形
        const sequenceLogo = document.getElementById('sequenceLogoContainer');
        sequenceLogo.innerHTML = `
            <div class="text-center">
                <p>此处将显示序列标志图</p>
                <p class="text-muted">在完整实现中，将使用序列标志图可视化库</p>
                <svg width="500" height="100" class="mx-auto d-block">
                    <rect x="10" y="10" width="480" height="80" fill="#f8f9fa" stroke="#dee2e6" />
                    <text x="250" y="55" text-anchor="middle" fill="#6c757d">
                        序列标志图将在此处显示
                    </text>
                </svg>
            </div>
        `;
    },
    
    // 下载结果
    downloadResults() {
        // 获取当前显示的结果
        const tableBody = document.getElementById('peptideTableBody');
        if (!tableBody.innerHTML.trim()) {
            alert('没有可下载的结果');
            return;
        }
        
        // 准备CSV数据
        const headers = ['排名', '肽段序列', '预测得分', 'MHC结合预测', '置信度'];
        const rows = Array.from(tableBody.querySelectorAll('tr')).map(row => {
            return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
        });
        
        // 创建CSV内容
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        // 下载CSV文件
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '预测肽段结果.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// 导出模块
export default tcrMhcPeptideModule; 