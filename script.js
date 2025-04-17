function navigateTo(url) {
    window.location.href = url;
  }
  
  function toggleStoreHelper() {
    document.getElementById("storeHelperModal").style.display = "flex";
  }
  
  function closeStoreHelper() {
    document.getElementById("storeHelperModal").style.display = "none";
    document.getElementById("storeOutput").innerHTML = '';
  }
  
  function generateStoreCodes() {
    const input = document.getElementById("storeInput").value;
    const output = document.getElementById("storeOutput");
    output.innerHTML = '';
  
    if (!/^\d{4}$/.test(input)) {
      output.innerHTML = "<p style='color: red;'>Enter exactly 4 digits.</p>";
      return;
    }
  
    const digits = input.split('');
    const results = new Set();
  
    function permute(arr, m = '') {
      if (arr.length === 0) results.add(m);
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m + next);
      }
    }
  
    permute(digits);
  
    [...results].forEach(code => {
      const div = document.createElement('div');
      div.style.marginBottom = "8px";
  
      const buttonId = `copy-${code}`;
      div.innerHTML = `
        <code style="font-size: 16px;">${code}</code>
        <button id="${buttonId}" onclick="copyAndMark('${code}', '${buttonId}')" style="
          margin-left: 10px;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        ">Copy</button>
      `;
      output.appendChild(div);
    });
  }
  
  function copyAndMark(text, buttonId) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById(buttonId);
      btn.innerText = "Copied";
      btn.style.backgroundColor = "#2ecc71";
      btn.style.color = "#fff";
      btn.disabled = true;
    });
  }
  