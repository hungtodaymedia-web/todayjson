import React, { useState, useEffect, useCallback } from 'react';
import { convertScriptToJsons } from './services/converter';
import type { AppState, NotificationType } from './types';
import { DEFAULT_SETUP_DESC, DEFAULT_INPUT_TEXT, DEFAULT_VOICE_INSTRUCTIONS } from './constants';
import Panel from './components/Panel';
import TextAreaInput from './components/TextAreaInput';
import StatCard from './components/StatCard';
import InfoBox from './components/InfoBox';
import Notification from './components/Notification';

const App: React.FC = () => {
    const [state, setState] = useState<AppState>({
        characterDescription: DEFAULT_SETUP_DESC,
        inputText: DEFAULT_INPUT_TEXT,
        voiceInstructions: DEFAULT_VOICE_INSTRUCTIONS,
        aspectRatio: '16:9',
        outputSetup: '',
        outputScenes: '',
        sceneCount: 0,
        totalDuration: 0,
        totalWords: 0,
        apiKeys: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

    useEffect(() => {
        const savedApiKeys = localStorage.getItem('geminiApiKeys');
        if (savedApiKeys) {
            setState(prevState => ({ ...prevState, apiKeys: savedApiKeys }));
        }
    }, []);

    const showNotification = (message: string, type: NotificationType, duration: number = 3000) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, duration);
    };

    const handleApiKeysChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const keys = e.target.value;
        setState(prevState => ({ ...prevState, apiKeys: keys }));
        localStorage.setItem('geminiApiKeys', keys);
    };

    const handleConvert = useCallback(async () => {
        if (!state.apiKeys.trim()) {
            showNotification('⚠️ Vui lòng nhập ít nhất một API Key!', 'warning');
            return;
        }
        if (!state.inputText.trim() || !state.characterDescription.trim()) {
            showNotification('⚠️ Vui lòng nhập mô tả nhân vật và kịch bản!', 'warning');
            return;
        }

        setIsLoading(true);
        showNotification('🤖 AI đang tạo cảnh... Vui lòng chờ.', 'info', 5000);

        try {
            const result = await convertScriptToJsons({
                characterDescription: state.characterDescription,
                inputText: state.inputText,
                aspectRatio: state.aspectRatio,
                voiceInstructions: state.voiceInstructions,
                apiKeys: state.apiKeys,
            });

            setState(prevState => ({
                ...prevState,
                outputSetup: result.setupJson,
                outputScenes: result.scenesJson,
                sceneCount: result.stats.sceneCount,
                totalDuration: result.stats.totalDuration,
                totalWords: result.stats.totalWords,
            }));
            
            showNotification('✅ Chuyển đổi thành công! JSON cài đặt và phân cảnh đã sẵn sàng.', 'success');
        } catch (error) {
            console.error("Conversion Error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.';
            showNotification(`❌ Lỗi Chuyển Đổi: ${errorMessage}`, 'error', 5000);
        } finally {
            setIsLoading(false);
        }
    }, [state]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'Enter') {
                if (!isLoading) {
                    handleConvert();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleConvert, isLoading]);

    const handleCopy = (type: 'scenes' | 'setup') => {
        const isScenes = type === 'scenes';
        const textToCopy = isScenes ? state.outputScenes : state.outputSetup;
        const typeName = isScenes ? 'Phân Cảnh' : 'Cài Đặt';
        
        if (!textToCopy) {
            showNotification('⚠️ Không có gì để sao chép!', 'warning');
            return;
        }
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification(`📋 Đã sao chép JSON ${typeName}!`, 'success');
        }).catch(() => {
            showNotification('❌ Sao chép thất bại!', 'error');
        });
    };

    const handleDownload = (type: 'scenes' | 'setup') => {
        const isScenes = type === 'scenes';
        const textToDownload = isScenes ? state.outputScenes : state.outputSetup;
        const typeName = isScenes ? 'Phân Cảnh' : 'Cài Đặt';
        const fileExtension = isScenes ? 'jsonl' : 'json';
        const filenamePrefix = isScenes ? 'scenes' : 'setup';

        if (!textToDownload) {
            showNotification('⚠️ Không có gì để tải xuống!', 'warning');
            return;
        }
        const filename = `veo3_${filenamePrefix}_${Date.now()}.${fileExtension}`;
        const blob = new Blob([textToDownload], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification(`💾 Đã tải xuống JSON ${typeName}!`, 'success');
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 min-h-screen p-2 sm:p-4 md:p-6 text-gray-200">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className="container max-w-screen-2xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                <header className="bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-700 text-white p-6 sm:p-8 text-center border-b border-gray-700">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        🎬 Trình Chuyển Đổi JSON VEO 3 AI
                    </h1>
                    <p className="mt-2 text-purple-200 text-sm sm:text-base">Kịch bản → JSON Cài Đặt & Phân Cảnh</p>
                    <span className="inline-block bg-white/10 text-purple-300 px-4 py-1 rounded-full text-xs font-semibold mt-4">
                        v6.2 Hỗ trợ nhiều API Key
                    </span>
                </header>

                <main className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
                    {/* Panel 1: Input */}
                    <Panel title="📝 Dữ Liệu Đầu Vào">
                        <TextAreaInput label="🔑 API Keys (mỗi key một dòng)" id="apiKeys" value={state.apiKeys} onChange={handleApiKeysChange} placeholder="Nhập một hoặc nhiều API key tại đây..." className="h-24" />

                        <div className="grid grid-cols-1 gap-4">
                             <div className="col-span-1">
                                <label htmlFor="aspectRatio" className="block text-xs font-semibold text-purple-300 mb-1">Tỷ Lệ Khung Hình</label>
                                <select id="aspectRatio" value={state.aspectRatio} onChange={e => setState({...state, aspectRatio: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500 transition">
                                    <option value="16:9">16:9</option>
                                    <option value="9:16">9:16</option>
                                </select>
                            </div>
                        </div>

                        <TextAreaInput label="👤 Mô Tả Nhân Vật & Bối Cảnh" id="characterDescription" value={state.characterDescription} onChange={e => setState({...state, characterDescription: e.target.value})} placeholder="Mô tả chi tiết nhân vật và bối cảnh tại đây..." className="h-64" />
                        
                        <TextAreaInput label="📜 Kịch Bản" id="inputText" value={state.inputText} onChange={e => setState({...state, inputText: e.target.value})} placeholder="Nhập kịch bản tại đây..." className="h-64" />
                        
                        <TextAreaInput label="🎙️ Hướng Dẫn Giọng Nói (Cho AI)" id="voiceInstructions" value={state.voiceInstructions} onChange={e => setState({...state, voiceInstructions: e.target.value})} placeholder="Mô tả chi tiết về tông giọng, tốc độ, và sắc thái..." className="h-24" />

                        <button onClick={handleConvert} disabled={isLoading} className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                            {isLoading ? '🧠 Đang xử lý...' : '🚀 Chuyển Đổi (Ctrl+Enter)'}
                        </button>
                        <InfoBox title="Cách Hoạt Động">
                           <ul className="space-y-1">
                                <li>Nhập nhiều API key để dự phòng khi một key bị lỗi hoặc quá tải.</li>
                                <li>Nhập mô tả nhân vật & bối cảnh để AI tạo JSON cài đặt.</li>
                                <li>Kịch bản của bạn được chia thành các cảnh dựa trên cài đặt.</li>
                            </ul>
                        </InfoBox>
                    </Panel>

                    {/* Right Column: Output Panels */}
                    <div className="flex flex-col gap-6">
                        {/* Panel 2: Setup JSON */}
                        <Panel title="⚙️ JSON Cài Đặt">
                            <div className="bg-blue-900/50 text-blue-300 p-3 rounded-lg text-sm border border-blue-700">
                                📋 File 1: Định nghĩa nhân vật và bối cảnh
                            </div>
                            <TextAreaInput id="outputSetup" value={state.outputSetup} readOnly placeholder="JSON cài đặt sẽ xuất hiện tại đây..." className="flex-grow min-h-[200px]" />
                            <div className="flex gap-4 mt-2">
                                <button onClick={() => handleCopy('setup')} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition">📋 Sao Chép</button>
                                <button onClick={() => handleDownload('setup')} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg transition">💾 Tải Xuống</button>
                            </div>
                            <InfoBox title="JSON Cài Đặt Chứa:">
                                <ul className="space-y-1">
                                    <li>Định nghĩa `character_lock` (CHAR_1)</li>
                                    <li>Định nghĩa `background_lock` (BACKGROUND_1)</li>
                                    <li>`visual_style` & `negative_prompt`</li>
                                </ul>
                            </InfoBox>
                        </Panel>

                        {/* Panel 3: Scenes JSON */}
                        <Panel title="🎬 JSON Phân Cảnh">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <StatCard label="Số Cảnh" value={state.sceneCount} />
                                <StatCard label="Thời Lượng" value={`${state.totalDuration}s`} />
                                <StatCard label="Số Từ" value={state.totalWords} />
                            </div>
                             <div className="bg-green-900/50 text-green-300 p-3 rounded-lg text-sm border border-green-700">
                                🎞️ File 2: Chi tiết từng cảnh (JSON Lines)
                            </div>
                            <TextAreaInput id="outputScenes" value={state.outputScenes} readOnly placeholder="JSON phân cảnh sẽ xuất hiện tại đây..." className="flex-grow min-h-[200px]" />
                            <div className="flex gap-4 mt-2">
                                 <button onClick={() => handleCopy('scenes')} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition">📋 Sao Chép</button>
                                 <button onClick={() => handleDownload('scenes')} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition">💾 Tải Xuống</button>
                            </div>
                        </Panel>
                    </div>
                </main>
                <footer className="text-center p-4 bg-gray-900/50 border-t border-gray-700">
                    <p className="text-xs text-gray-400">🎯 <strong>Phiên Bản Chuẩn VEO 3 AI</strong> - Kịch bản → Cài Đặt & Cảnh</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
