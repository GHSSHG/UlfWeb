// MHC和Peptide二元结合模块

// 导入工具函数
import { parseFile, downloadData } from '../utils.js';

// 模块定义
const mhcPeptideModule = {
    id: 'mhc-peptide',
    name: 'MHC和Peptide二元结合分析',
    
    // 初始化模块
    init() {
        console.log('初始化MHC-Peptide模块');
        // 注册模块
        window.app.registerModule(this.id, this);
    },
    
    // 激活模块
    activate() {
        console.log('激活MHC-Peptide模块');
        
        // 获取内容容器
        const container = document.getElementById('moduleContainer');
        
        // 渲染模块UI
        container.innerHTML = `
            <div class="module-header">
                <h3>MHC和Peptide二元结合分析</h3>
                <p>分析MHC与Peptide的结合亲和力和相互作用特性</p>
            </div>
            
            <div class="row">
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
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>Peptide序列</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">输入方式</label>
                                <select class="form-select" id="peptideInputType">
                                    <option value="text">直接输入序列</option>
                                    <option value="file">上传文件</option>
                                </select>
                            </div>
                            
                            <div id="peptideTextInput" class="mb-3">
                                <label for="peptideSequence" class="form-label">Peptide序列</label>
                                <textarea class="form-control" id="peptideSequence" rows="3" placeholder="输入单个或多个肽段序列，每行一个"></textarea>
                            </div>
                            
                            <div id="peptideFileInput" class="mb-3" style="display:none">
                                <label class="form-label">上传Peptide文件</label>
                                <div class="file-upload-zone" id="peptideDropZone">
                                    <p>拖放文件到这里或点击选择文件</p>
                                    <input type="file" id="peptideFile" style="display:none" accept=".fasta,.txt,.csv">
                                    <button class="btn btn-outline-primary btn-sm" id="selectPeptideFileBtn">选择文件</button>
                                </div>
                                <div class="form-text">支持FASTA, TXT或CSV格式</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5>分析参数</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">预测方法</label>
                                        <select class="form-select" id="predictionMethod">
                                            <option value="binding">结合亲和力预测</option>
                                            <option value="stability">复合物稳定性预测</option>
                                            <option value="immunogenicity">免疫原性评估</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">阈值设置</label>
                                        <div class="input-group">
                                            <select class="form-select" id="thresholdType">
                                                <option value="ic50">IC50 (nM)</option>
                                                <option value="rank">百分比排名</option>
                                            </select>
                                            <input type="number" class="form-control" id="thresholdValue" value="500">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-5">
                <button class="btn btn-primary btn-lg" id="startAnalysisBtn">开始分析</button>
            </div>
            
            <div class="results-container mt-4" id="resultsContainer" style="display:none">
                <h4>分析结果</h4>
                <div class="alert alert-info">
                    <strong>分析完成。</strong> <span id="resultSummary"></span>
                </div>
                
                <ul class="nav nav-tabs" id="resultTabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#tableTab">表格视图</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#chartTab">图表视图</a>
                    </li>
                </ul>
                
                <div class="tab-content mt-3">
                    <div class="tab-pane fade show active" id="tableTab">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered" id="resultsTable">
                                <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>Peptide序列</th>
                                        <th>MHC等位基因</th>
                                        <th>评分</th>
                                        <th>结合级别</th>
                                    </tr>
                                </thead>
                                <tbody id="resultsTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="chartTab">
                        <canvas id="resultsChart" height="300"></canvas>
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
        
        // 加载之前的结果
        this.loadPreviousResults();
    },
    
    // 模块停用
    deactivate() {
        console.log('停用MHC-Peptide模块');
    },
    
    // 设置事件监听
    setupEventListeners() {
        // Peptide输入类型切换
        document.getElementById('peptideInputType').addEventListener('change', (e) => {
            const inputType = e.target.value;
            document.getElementById('peptideTextInput').style.display = inputType === 'text' ? 'block' : 'none';
            document.getElementById('peptideFileInput').style.display = inputType === 'file' ? 'block' : 'none';
        });
        
        // 文件选择按钮
        document.getElementById('selectPeptideFileBtn').addEventListener('click', () => {
            document.getElementById('peptideFile').click();
        });
        
        // 文件上传处理
        document.getElementById('peptideFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                this.handleFileSelected(file);
            }
        });
        
        // 拖放区域事件
        const dropZone = document.getElementById('peptideDropZone');
        
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
        
        // MHC类型变更
        document.getElementById('mhcType').addEventListener('change', () => {
            this.updateMhcAlleleOptions();
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
    
    // 处理所选文件
    handleFileSelected(file) {
        // 处理上传文件的逻辑
        document.getElementById('peptideDropZone').innerHTML = `
            <p>已选择: ${file.name}</p>
            <button class="btn btn-outline-secondary btn-sm" id="changePeptideFileBtn">更换文件</button>
        `;
        
        document.getElementById('changePeptideFileBtn').addEventListener('click', () => {
            document.getElementById('peptideFile').click();
        });
        
        this.peptideFile = file;
    },
    
    // 更新MHC等位基因选项
    updateMhcAlleleOptions() {
        // 根据MHC类型更新等位基因下拉列表
        const mhcType = document.getElementById('mhcType').value;
        const alleleSelect = document.getElementById('mhcAllele');
        
        // 清除现有选项
        alleleSelect.innerHTML = '';
        
        // 添加新选项
        const alleles = mhcType === 'I' 
            ? ['HLA-A*02:01', 'HLA-A*01:01', 'HLA-B*07:02', 'HLA-B*08:01', 'HLA-C*07:01'] 
            : ['HLA-DRB1*01:01', 'HLA-DRB1*03:01', 'HLA-DRB1*04:01', 'HLA-DQA1*01:01/DQB1*05:01'];
            
        alleles.forEach(allele => {
            const option = document.createElement('option');
            option.value = allele;
            option.textContent = allele;
            alleleSelect.appendChild(option);
        });
    },
    
    // 加载历史分析结果
    loadPreviousResults() {
        // 加载并显示之前的分析结果
        const previousResults = window.app.getResults(this.id) || [];
        
        if (previousResults.length > 0) {
            const container = document.getElementById('previousResults');
            
            let html = `
                <div class="mt-5">
                    <h4>历史分析结果</h4>
                    <div class="table-responsive">
                        <table class="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>MHC等位基因</th>
                                    <th>分析方法</th>
                                    <th>序列数量</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- 历史结果行将通过JS添加 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
            // 在实际应用中会添加事件监听以显示历史结果
        }
    },
    
    // 开始分析
    async startAnalysis() {
        // 验证输入
        if (!this.validateInput()) {
            return;
        }
        
        // 显示处理对话框
        const modal = window.app.showProcessing('正在分析MHC-Peptide结合特性...');
        
        try {
            // 收集参数
            const params = this.collectAnalysisParameters();
            
            // 模拟分析过程
            await this.simulateAnalysis(params);
            
            // 生成结果数据
            const results = this.generateMockResults(params);
            
            // 保存结果
            window.app.saveResult(this.id, {
                ...params,
                results,
                resultCount: results.length,
                timestamp: new Date().toISOString()
            });
            
            // 显示结果
            this.displayResults(results);
            
        } catch (error) {
            console.error('分析过程中出错:', error);
            alert('分析过程中发生错误: ' + error.message);
        } finally {
            // 隐藏处理对话框
            window.app.hideProcessing();
        }
    },
    
    // 验证输入
    validateInput() {
        // 简单的输入验证逻辑
        const inputType = document.getElementById('peptideInputType').value;
        
        if (inputType === 'text') {
            const peptideText = document.getElementById('peptideSequence').value.trim();
            if (!peptideText) {
                alert('请输入Peptide序列');
                return false;
            }
        } else {
            if (!this.peptideFile) {
                alert('请选择Peptide文件');
                return false;
            }
        }
        
        return true;
    },
    
    // 收集分析参数
    collectAnalysisParameters() {
        // 收集UI中的参数值
        return {
            mhcType: document.getElementById('mhcType').value,
            mhcAllele: document.getElementById('mhcAllele').value,
            predictionMethod: document.getElementById('predictionMethod').value,
            thresholdType: document.getElementById('thresholdType').value,
            thresholdValue: document.getElementById('thresholdValue').value
        };
    },
    
    // 模拟分析过程
    async simulateAnalysis(params) {
        // 模拟分析过程的异步操作
        for (let i = 0; i <= 100; i += 10) {
            window.app.updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },
    
    // 生成模拟结果数据
    generateMockResults(params) {
        // 生成示例结果数据
        const results = [];
        const sequences = ['GILGFVFTL', 'NLVPMVATV', 'GLCTLVAML', 'LLWNGPMAV', 'YLQPRTFLL'];
        
        sequences.forEach((seq, index) => {
            const score = Math.random() * 1000;
            let level;
            
            if (score < 50) level = '强结合';
            else if (score < 500) level = '中等结合';
            else level = '弱结合';
            
            results.push({
                id: index + 1,
                sequence: seq,
                mhcAllele: params.mhcAllele,
                score: score.toFixed(2),
                level: level
            });
        });
        
        return results;
    },
    
    // 显示分析结果
    displayResults(results) {
        // 显示结果数据
        document.getElementById('resultsContainer').style.display = 'block';
        document.getElementById('resultSummary').textContent = `共分析了 ${results.length} 个肽段序列。`;
        
        // 填充结果表格
        const tableBody = document.getElementById('resultsTableBody');
        tableBody.innerHTML = '';
        
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.id}</td>
                <td>${result.sequence}</td>
                <td>${result.mhcAllele}</td>
                <td>${result.score}</td>
                <td>${result.level}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // 在实际应用中将创建图表
        document.getElementById('resultsChart').getContext('2d');
        // 图表创建逻辑将在这里实现
    },
    
    // 下载结果
    downloadResults() {
        // 下载结果数据
        const currentResults = document.getElementById('resultsTableBody').innerHTML;
        
        if (!currentResults.trim()) {
            alert('没有可下载的结果');
            return;
        }
        
        // 创建CSV格式数据
        const headers = ['序号', 'Peptide序列', 'MHC等位基因', '评分', '结合级别'];
        
        // 使用工具函数下载数据
        // 实际应用中会转换数据并调用downloadData函数
        alert('结果已准备好下载');
    }
};

// 导出模块
export default mhcPeptideModule; 