"use client";

import { useState, useRef } from "react";
import { useNotifications } from "@/components/notifications/Notifications";

interface UploadComponentProps {
  onUploadSuccess: (url: string, fileName: string) => void;
  accept?: string;
  maxSize?: number; // MB
}

export function UploadComponent({ onUploadSuccess, accept, maxSize = 10 }: UploadComponentProps) {
  const { showNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      showNotification({
        type: "error",
        title: "文件太大",
        message: `文件大小不能超過 ${maxSize}MB`,
      });
      return;
    }

    // 验证文件类型
    const allowedTypes = accept?.split(",").map(type => type.trim()) || [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotification({
        type: "error",
        title: "文件類型不支持",
        message: "請選擇支持的文件格式",
      });
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          showNotification({
            type: "success",
            title: "上傳成功",
            message: `${response.fileName} 已成功上傳`,
          });
          onUploadSuccess(response.url, response.fileName);
          setUploadProgress(0);
        } else {
          const response = JSON.parse(xhr.responseText);
          showNotification({
            type: "error",
            title: "上傳失敗",
            message: response.error || "上傳失敗，請稍後再試",
          });
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        showNotification({
          type: "error",
          title: "上傳失敗",
          message: "網絡錯誤，請檢查您的連接",
        });
        setUploading(false);
        setUploadProgress(0);
      };

      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    } catch (error) {
      showNotification({
        type: "error",
        title: "上傳失敗",
        message: "上傳失敗，請稍後再試",
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // 重新验证
    if (file.size > maxSize * 1024 * 1024) {
      showNotification({
        type: "error",
        title: "文件太大",
        message: `文件大小不能超過 ${maxSize}MB`,
      });
      return;
    }

    uploadFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center transition-all hover:border-indigo-500 hover:bg-indigo-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="text-2xl">📤</div>
            <div className="text-lg font-semibold text-slate-700">
              上傳中... {uploadProgress}%
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500">
              請稍候，文件正在上傳...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-5xl">📁</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                上傳文件
              </h3>
              <p className="text-slate-600">
                點擊或拖拽文件到此處
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all"
              >
                選擇文件
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold">支持：</span>
              <span>圖片 (JPG, PNG, GIF)</span>
              <span>• 文檔 (PDF, Word)</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold">最大大小：</span>
              <span>{maxSize}MB</span>
            </div>
          </div>
        )}
      </div>

      {uploading && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-blue-700 font-medium">文件上傳中，請勿關閉頁面</span>
          </div>
          <span className="text-blue-700 font-bold">{uploadProgress}%</span>
        </div>
      )}
    </div>
  );
}
