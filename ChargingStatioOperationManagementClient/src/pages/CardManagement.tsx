import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockChargeCards } from '@/lib/mockData';
import { Pagination } from '@/components/Pagination';

export default function CardManagement() {
  const [cards, setCards] = useState(mockChargeCards);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const paginatedCards = cards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const [currentCard, setCurrentCard] = useState<typeof mockChargeCards[0] | null>(null);

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    toast.success('删除成功');
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive') => {
    setCards(cards.map(card => 
      card.id === id ? {...card, status} : card
    ));
    toast.success(`卡片已${status === 'active' ? '激活' : '停用'}`);
  };

  const handleRecharge = (id: string, amount: number) => {
    setCards(cards.map(card => 
      card.id === id ? {...card, balance: card.balance + amount} : card
    ));
    toast.success(`充值成功，金额: ¥${amount}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">充电卡管理</h1>
        <button
          onClick={() => {
            setCurrentCard(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新增充电卡
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
             <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电卡编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">归属客户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">身份证号码</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会员等级</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开卡时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">卡内金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {paginatedCards.map(card => (
               <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{card.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.idCard}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.level.toUpperCase()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.createTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{card.balance}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    card.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  } text-white`}>
                    {card.status === 'active' ? '已激活' : '未激活'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentCard(card);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    查看
                  </button>
                  <button
                    onClick={() => {
                      setCurrentCard(card);
                      setIsFormOpen(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      const amount = prompt('请输入充值金额', '100');
                      if (amount && !isNaN(parseFloat(amount))) {
                        handleRecharge(card.id, parseFloat(amount));
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    充值
                  </button>
                  <button
                    onClick={() => handleStatusChange(card.id, card.status === 'active' ? 'inactive' : 'active')}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    {card.status === 'active' ? '停用' : '激活'}
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 表单弹窗 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentCard ? '编辑充电卡' : '新增充电卡'}</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const card = {
                id: currentCard?.id || Date.now().toString(),
                code: formData.get('code') as string,
                customer: formData.get('customer') as string,
                phone: formData.get('phone') as string,
                idCard: formData.get('idCard') as string,
                level: formData.get('level') as 'vip1' | 'vip2' | 'vip3' | 'vip4' | 'vip5' | 'vip6',
                createTime: currentCard?.createTime || new Date().toISOString(),
                balance: currentCard?.balance || 0,
                status: formData.get('status') as 'active' | 'inactive'
              };
              if (currentCard) {
                setCards(cards.map(c => c.id === currentCard.id ? card : c));
              } else {
                setCards([...cards, card]);
              }
              setIsFormOpen(false);
              toast.success(currentCard ? '更新成功' : '添加成功');
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">充电卡编号</label>
                  <input
                    name="code"
                    type="text"
                    defaultValue={currentCard?.code || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">身份证号码</label>
                  <input
                    name="idCard"
                    type="text"
                    defaultValue={currentCard?.idCard || ''}
                    required
                    pattern="\d{17}[\dXx]"
                    title="请输入18位身份证号码"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">归属客户</label>
                  <input
                    name="customer"
                    type="text"
                    defaultValue={currentCard?.customer || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">联系电话</label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={currentCard?.phone || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">身份证号码</label>
                  <input
                    name="idCard"
                    type="text"
                    defaultValue={currentCard?.idCard || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">会员等级</label>
                  <select
                    name="level"
                    defaultValue={currentCard?.level || 'vip1'}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="vip1">VIP1</option>
                    <option value="vip2">VIP2</option>
                    <option value="vip3">VIP3</option>
                    <option value="vip4">VIP4</option>
                    <option value="vip5">VIP5</option>
                    <option value="vip6">VIP6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">状态</label>
                  <select
                    name="status"
                    defaultValue={currentCard?.status || 'active'}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">已激活</option>
                    <option value="inactive">未激活</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    保存
                   </button>
                 </div>
               </div>
             </form>
           </div>
         </div>
       )}
       
       <div className="mt-4">
         <Pagination 
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={setCurrentPage}
         />
       </div>
     </div>
  );
}