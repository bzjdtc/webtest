<script setup lang="ts">

import appQrCode from '@/assets/ui/app.png'

</script>

<template>
  <footer class="bg-white pt-20 pb-10 border-t border-gray-100">
    <div class="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between gap-8">
        <!-- 联系方式 -->
        <div class="space-y-4">
            <h3 class="text-lg font-bold text-gray-800">客户服务</h3>
            <div class="grid grid-cols-2 gap-4 text-gray-500 text-sm">
                <a href="#" class="hover:text-emerald-500">在线客服</a>
                <a href="#" class="hover:text-emerald-500">问题反馈</a>
                <a href="#" class="hover:text-emerald-500">售后政策</a>
                <a href="#" class="hover:text-emerald-500">联系我们</a>
            </div>
        </div>
        <!-- 关于 -->
        <div class="space-y-4">
            <h3 class="text-lg font-bold text-gray-800">关于我们</h3>
            <p class="text-gray-500 text-sm max-w-xs">
                小兔鲜儿致力于为消费者提供新鲜、优质、平价的生鲜产品。
            </p>
        </div>
        <!-- 二维码 -->
        <div class="flex gap-4">
            <div class="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                <img :src=appQrCode></img>  
            </div>
            
            <div class="text-xs space-y-2 flex flex-col justify-center">
                <p>扫描二维码</p>
                <p>立马下载APP</p>
          </div>
        </div>
    </div>
    <div class="container mx-auto mt-10 pt-10 border-t border-gray-100 text-center text-gray-400 text-xs">
        © 2025 XiaoTuXian. All rights reserved.
    </div>
  </footer>
</template>