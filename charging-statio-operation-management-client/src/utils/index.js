import { Loading, Message } from "element-ui";
import api from "@/api";
import * as XLSX from "xlsx";
export default {
  point: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
  pointToAry: (data) => {
    return [data.x, data.y];
  },
  async uploadImage(options) {
    // 显示上传中提示
    const loading = Loading.service({
      lock: true,
      text: "图片上传中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    try {
      // 创建FormData对象
      const formData = new FormData();
      formData.append("file", options.file);

      // 调用API上传图片
      const response = await api.util.uploadImage(formData);

      // 关闭加载提示
      loading.close();

      // 处理响应
      if (response.data.code === 200) {
        Message.success("上传成功");
        // 如果需要，可以调用options.onSuccess回调
        if (options.onSuccess) {
          options.onSuccess(response.data);
        }
        return response.data.data;
      } else {
        Message.error(response.data.msg || "上传失败");
        // 如果需要，可以调用options.onError回调
        if (options.onError) {
          options.onError(new Error(response.data.msg || "上传失败"));
        }
      }
    } catch (error) {
      loading.close();
      console.error("图片上传失败:", error);
      Message.error("图片上传失败，请重试");
      // 如果需要，可以调用options.onError回调
      if (options.onError) {
        options.onError(error);
      }
    }
  },
  exportExcel(tableName, tilte, data, wscols) {
    const exportData = [[tableName + "统计表"], tilte, ...data];
    // 生成工作表
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    // 合并单元格
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const lastColumn = XLSX.utils.encode_col(range.e.c);
    if (!worksheet["!merges"]) worksheet["!merges"] = [];
    worksheet["!merges"].push({
      s: { r: 0, c: 0 },
      e: { r: 0, c: range.e.c },
    });
    // 如果有列宽久设置列宽
    if (wscols) {
      // const wscols = [
      //   { wch: 10 },
      //   { wch: 5 },
      //   { wch: 5 },
      // ];
      worksheet["!cols"] = wscols;
    }
    // 生成工作簿
    const workbook = XLSX.utils.book_new();
    // 将工作表添加到工作簿中
    XLSX.utils.book_append_sheet(workbook, worksheet, tableName);

    // 导出
    XLSX.writeFile(workbook, `${tableName}.xlsx`);
  },
};
