<template>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-4 border-b">
            <h3 class="text-xl font-semibold">排班結果預覽 (2025年 10月)</h3>
            <p class="text-sm text-gray-600">這是根據您的設定所產生的班表草稿。</p>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full leading-normal">
                <thead>
                    <tr
                        class="border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <th class="px-5 py-3">員工</th>
                        <th class="px-5 py-3">...</th>
                        <th class="px-5 py-3">週三 (1)</th>
                        <th class="px-5 py-3">週四 (2)</th>
                        <!-- ... 其他日期 -->
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-gray-200">
                        <td class="px-5 py-5 bg-white text-sm font-semibold">陳小美</td>
                        <td class="px-5 py-5 bg-white text-sm">...</td>
                        <td class="px-5 py-5 bg-white text-sm">
                            <div class="bg-orange-100 text-orange-800 p-2 rounded-lg text-center">中</div>
                        </td>
                        <td class="px-5 py-5 bg-white text-sm">
                            <div class="bg-orange-100 text-orange-800 p-2 rounded-lg text-center">中</div>
                        </td>
                        <!-- ... 其他班別 -->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>