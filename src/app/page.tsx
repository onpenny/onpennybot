export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-6">
            OnHeritage
          </h1>
          <p className="text-2xl text-slate-600 mb-8">
            一站式遺產管理平台
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <p className="text-slate-700 mb-6">
              幫助您妥善管理資產、建立家族譜系、規劃遺囑，確保財富與記憶的順利傳承。
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-slate-50 rounded-lg">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-semibold mb-2">資產管理</h3>
                <p className="text-slate-600">
                  統一管理各類資產，從銀行到收藏品，一應俱全
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg">
                <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-semibold mb-2">家族譜系</h3>
                <p className="text-slate-600">
                  可視化族譜，清晰記錄家族關係與繼承規則
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg">
                <div className="text-4xl mb-3">📜</div>
                <h3 className="text-xl font-semibold mb-2">遺囑規劃</h3>
                <p className="text-slate-600">
                  專業模板與法律指引，讓遺產分配明確有序
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition">
              開始使用
            </button>
            <button className="px-8 py-3 border-2 border-slate-900 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition">
              了解更多
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
