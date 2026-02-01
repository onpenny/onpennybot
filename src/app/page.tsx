export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-6xl font-bold px-8 py-4 rounded-2xl shadow-2xl">
                OnHeritage
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              您的遺產，您的傳承
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              幫助您妥善管理資產、建立家族譜系、規劃遺囑、<br />
              確保財富與記憶的順利傳承給下一代
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105 hover:shadow-indigo-500/30"
              >
                立即開始
              </a>
              <a
                href="/auth/signin"
                className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                登入賬戶
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">資產管理</h3>
              <p className="text-slate-600 leading-relaxed">
                統一管理銀行、保險、不動產、收藏品等各類資產，一目了然
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">家族譜系</h3>
              <p className="text-slate-600 leading-relaxed">
                可視化族譜，清晰記錄家族關係，設定繼承規則
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">📜</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">遺囑規劃</h3>
              <p className="text-slate-600 leading-relaxed">
                專業模板與法律指引，讓遺產分配明確有序，避免糾紛
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">為什麼選擇 OnHeritage？</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">銀級安全</h3>
                <p className="text-indigo-100">
                  AES-256 加密技術，保護您的敏感信息
                </p>
              </div>
              <div>
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">智能提示</h3>
                <p className="text-indigo-100">
                  自動提醒資產盤點，防止遺忘漏記
                </p>
              </div>
              <div>
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-2">跨境支持</h3>
                <p className="text-indigo-100">
                  支持多地區法域，滿足海外資產繼承需求
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-slate-500 mb-4">
              已有超過 10,000 家庭選擇我們
            </p>
            <a
              href="/auth/signup"
              className="inline-block px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all"
            >
              免費開始使用
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
