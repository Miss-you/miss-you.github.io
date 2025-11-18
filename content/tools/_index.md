+++
title = "Tools · 常用小工具"
description = "经常要用到的小工具集合，先从 Unix 时间戳转换开始。"
layout = "single"
+++

欢迎来到 **Yousa Driven Development** 的工具台。这里会陆续放上一些日常开发/写作/排查时常用的小工具。  
目前先上线一个简单的 **Unix 时间戳 ↔ 人类可读时间** 转换器。

<div class="tool-card">
  <h2>Unix 时间戳转换</h2>
  <p>支持秒/毫秒时间戳自动识别，也可以把日期字符串转换回 Unix 时间。</p>

  <div class="tool-grid">
    <label>
      <span>Unix 时间戳</span>
      <input id="unixInput" type="text" placeholder="例如 1719897600 或 1719897600000" />
    </label>
    <label>
      <span>日期时间 (本地时区)</span>
      <input id="dateInput" type="datetime-local" />
    </label>
  </div>

  <div class="tool-actions">
    <button class="cursor-btn" id="btnToHuman">↗ 转成可读时间</button>
    <button class="cursor-btn cursor-btn--ghost" id="btnToUnix">↘ 转回 Unix 时间</button>
    <button class="cursor-btn cursor-btn--ghost" id="btnNow">⏱ 当前时间</button>
  </div>

  <div class="tool-result">
    <p><strong>ISO 8601:</strong> <span id="isoResult">-</span></p>
    <p><strong>本地字符串:</strong> <span id="localResult">-</span></p>
    <p><strong>Unix 秒:</strong> <span id="unixSeconds">-</span></p>
    <p><strong>Unix 毫秒:</strong> <span id="unixMillis">-</span></p>
  </div>
</div>

<script>
  (() => {
    const unixInput = document.getElementById("unixInput");
    const dateInput = document.getElementById("dateInput");
    const isoResult = document.getElementById("isoResult");
    const localResult = document.getElementById("localResult");
    const unixSeconds = document.getElementById("unixSeconds");
    const unixMillis = document.getElementById("unixMillis");

    const toHuman = () => {
      const raw = unixInput.value.trim();
      if (!raw) return;
      let num = Number(raw);
      if (Number.isNaN(num)) return;
      if (raw.length === 10) num = num * 1000;
      const date = new Date(num);
      if (isNaN(date.getTime())) return;

      dateInput.value = new Date(num - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      isoResult.textContent = date.toISOString();
      localResult.textContent = date.toLocaleString();
      unixSeconds.textContent = Math.floor(num / 1000);
      unixMillis.textContent = num;
    };

    const toUnix = () => {
      if (!dateInput.value) return;
      const date = new Date(dateInput.value);
      const ms = date.getTime();
      if (isNaN(ms)) return;
      unixInput.value = Math.floor(ms / 1000);
      isoResult.textContent = date.toISOString();
      localResult.textContent = date.toLocaleString();
      unixSeconds.textContent = Math.floor(ms / 1000);
      unixMillis.textContent = ms;
    };

    const fillNow = () => {
      const now = Date.now();
      unixInput.value = Math.floor(now / 1000);
      dateInput.value = new Date(now - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      toHuman();
    };

    document.getElementById("btnToHuman").addEventListener("click", toHuman);
    document.getElementById("btnToUnix").addEventListener("click", toUnix);
    document.getElementById("btnNow").addEventListener("click", fillNow);

    unixInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") toHuman();
    });
    dateInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") toUnix();
    });

    fillNow();
  })();
</script>
