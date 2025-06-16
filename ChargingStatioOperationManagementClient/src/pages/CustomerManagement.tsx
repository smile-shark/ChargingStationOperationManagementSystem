import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockCustomers } from '@/lib/mockData';
import { Pagination } from '@/components/Pagination';

interface Customer {
  id: string;
  name: string;
  account: string;
  phone: string;
  type: 'personal' | 'company';
  vehicleCount: number;
  hasCard: boolean;
  accountType: 'prepaid' | 'postpaid' | 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  password: string;
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedCustomers = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (id: string, status: 'active' | 'inactive') => {
    setCustomers(customers.map(customer => 
      customer.id === id ? {...customer, status} : customer
    ));
    toast.success(`客户已${status === 'active' ? '启用' : '停用'}`);
  };

  const handleDelete = (id: string) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    toast.success('删除成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">客户管理</h1>
        <button
          onClick={() => {
            setCurrentCustomer(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新增客户
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登录账户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关联车辆数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">是否开充电卡</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账户类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.account}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.type === 'personal' ? '个人普通用户' : '公司合作用户'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.vehicleCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.hasCard ? '是' : '否'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.accountType === 'prepaid' ? '预付费' : 
                   customer.accountType === 'postpaid' ? '后付费' :
                   customer.accountType === 'monthly' ? '月结算付费' : '年结算付费'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  } text-white`}>
                    {customer.status === 'active' ? '正常' : '停用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentCustomer(customer);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleStatusChange(customer.id, customer.status === 'active' ? 'inactive' : 'active')}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    {customer.status === 'active' ? '停用' : '启用'}
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
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

      <div className="mt-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(customers.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 表单弹窗 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentCustomer ? '编辑客户' : '新增客户'}</h2>
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
              const customer = {
                id: currentCustomer?.id || Date.now().toString(),
                name: formData.get('name') as string,
                account: formData.get('account') as string,
                phone: formData.get('phone') as string,
                type: formData.get('type') as 'personal' | 'company',
                vehicleCount: parseInt(formData.get('vehicleCount') as string),
                hasCard: formData.get('hasCard') === 'true',
                accountType: formData.get('accountType') as 'prepaid' | 'postpaid' | 'monthly' | 'yearly',
                status: formData.get('status') as 'active' | 'inactive',
                password: formData.get('password') as string
              };
              if (currentCustomer) {
                setCustomers(customers.map(c => c.id === currentCustomer.id ? customer : c));
              } else {
                setCustomers([...customers, customer]);
              }
              setIsFormOpen(false);
              toast.success(currentCustomer ? '更新成功' : '添加成功');
            }}>
              <div className="space-y-6">
                {/* 基本信息部分 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                    基本信息
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <i className="fas fa-user text-gray-400 mr-2"></i>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        <span>客户名称</span>
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={currentCustomer?.name || ''}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                    <div className="flex items-center">
                      <i className="fas fa-id-card text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">客户类型</label>
                        <select
                          name="type"
                          defaultValue={currentCustomer?.type || 'personal'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="personal">个人普通用户</option>
                          <option value="company">公司合作用户</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-phone text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">联系电话</label>
                        <input
                          name="phone"
                          type="tel"
                          defaultValue={currentCustomer?.phone || ''}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-car text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">关联车辆数</label>
                        <input
                          name="vehicleCount"
                          type="number"
                          min="0"
                          defaultValue={currentCustomer?.vehicleCount || 0}
                          readOnly
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 账户信息部分 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <i className="fas fa-wallet text-blue-500 mr-2"></i>
                    账户信息
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <i className="fas fa-user-tag text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">登录账户</label>
                        <input
                          name="account"
                          type="text"
                          defaultValue={currentCustomer?.account || ''}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-key text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">登录密码</label>
                        <input
                          name="password"
                          type="password"
                          defaultValue={currentCustomer?.password || ''}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-credit-card text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">是否开充电卡</label>
                        <select
                          name="hasCard"
                          defaultValue={currentCustomer?.hasCard ? 'true' : 'false'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="true">是</option>
                          <option value="false">否</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-money-bill-wave text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">账户类型</label>
                        <select
                          name="accountType"
                          defaultValue={currentCustomer?.accountType || 'prepaid'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="prepaid">预付费</option>
                          <option value="postpaid">后付费</option>
                          <option value="monthly">月结算付费</option>
                          <option value="yearly">年结算付费</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-power-off text-gray-400 mr-2"></i>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">状态</label>
                        <select
                          name="status"
                          defaultValue={currentCustomer?.status || 'active'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">正常</option>
                          <option value="inactive">停用</option>
                        </select>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
}