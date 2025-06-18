import { Loading, Message } from "element-ui";
import api from "@/api";
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
};
