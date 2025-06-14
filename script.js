let globalTweets = [];

document.addEventListener('DOMContentLoaded', () => {
  const savedSymbol = localStorage.getItem('continueSymbol');
  if (savedSymbol) {
    const input = document.getElementById('continueSymbol');
    if (input) {
      input.value = savedSymbol;
      highlightActiveSymbol(savedSymbol);
    }
  }
});

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function updateLiveCounter() {
  const text = document.getElementById('inputText').value;
  document.getElementById('liveCounter').textContent = `تعداد کاراکتر: ${text.length}`;
}

function splitIntoTweets(text, maxLen = 275) {
  const words = text.split(/\s+/);
  let tweets = [], current = '';
  const continueSymbol = document.getElementById('continueSymbol')?.value || '»';
  const hashtag = '#رشتو\n';

  for (let word of words) {
    const temp = current ? current + ' ' + word : word;
    // طول توییت اول با هشتگ و ادامه‌دهنده
    const isFirst = tweets.length === 0;
    const simulatedTweet = (isFirst ? hashtag : '') + temp + ' ' + continueSymbol;

    if (simulatedTweet.trim().length > maxLen) {
      tweets.push(current.trim());
      current = word;
    } else {
      current = temp;
    }
  }

  if (current.trim()) tweets.push(current.trim());
  return tweets.map((t, i) => {
    const prefix = `${i + 1}/${tweets.length} `;
    const content = (i === 0 ? hashtag : '') + t;
    return prefix + content;
  });
}

function generateTweets() {
  const text = document.getElementById('inputText').value;
  const tweets = splitIntoTweets(text);
  globalTweets = tweets;
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  tweets.forEach((originalTweet, i) => {
    const isLast = i === tweets.length - 1;
    const continueSymbol = document.getElementById('continueSymbol')?.value || '»';

    let tweetText = originalTweet;
    
    if (i === 0) {
      tweetText = `#رشتو\n${tweetText}`;
    }

    if (!isLast) {
      tweetText += ` ${continueSymbol}`;
    }

    const tweetLength = tweetText.length;
    const countClass = tweetLength > 280 ? 'char-count over' : 'char-count';

    const div = document.createElement('div');
    div.className = 'tweet';
    div.innerHTML = `
      <div class="counter">توییت ${i + 1}</div>
      <div>${tweetText.replace(/\n/g, '<br>')}</div>
      <div class="${countClass}">تعداد کاراکتر: ${tweetLength}</div>
      <div class="share-container">
        <button class="copy-btn" onclick="copyToClipboard(this)">کپی 📋</button>
        <button class="share-btn" onclick="shareTelegram(\`${tweetText}\`)">تلگرام ✈️</button>
        <button class="share-btn" onclick="shareWhatsApp(\`${tweetText}\`)">واتساپ 🟢</button>
        <button class="share-btn" onclick="shareTwitter(\`${tweetText}\`)">توییتر 🐦</button>
      </div>
    `;
    outputDiv.appendChild(div);
  });
}


function copyToClipboard(button) {
  const tweetText = button.parentElement.parentElement.querySelector('div:nth-child(2)').innerText;
  navigator.clipboard.writeText(tweetText).then(() => {
    button.textContent = 'کپی شد ✅';
    setTimeout(() => button.textContent = 'کپی 📋', 1500);
  });
}

function copyAllTweets() {
  if (globalTweets.length === 0) return;
  const fullText = globalTweets.join('\n\n');
  navigator.clipboard.writeText(fullText).then(() => {
    alert('✅ کل رشتو کپی شد!');
  });
}

function shareTweet(tweet) {
  const decoded = decodeURIComponent(tweet);
  const url = `https://t.me/share/url=${encodeURIComponent(decoded)}`;
  window.open(url, '_blank');
}

function shareWhatsApp(tweet) {
  const decoded = decodeURIComponent(tweet);
  window.open(`https://api.whatsapp.com/send?text=${decoded}`, '_blank');
}

function shareTwitter(tweet) {
  const decoded = decodeURIComponent(tweet);
  window.open(`https://twitter.com/intent/tweet?text=${decoded}`, '_blank');
}


function minifyText() {
  const textarea = document.getElementById('inputText');
  let text = textarea.value;
  text = text.replace(/\s{2,}/g, ' ');
  text = text.replace(/ ،/g, ',');
  text = text.replace(/ \./g, '.');
  textarea.value = text.trim();
  updateLiveCounter();
}
function toggleEmojiPicker() {
    const wrapper = document.getElementById('emojiPickerWrapper');
    wrapper.classList.toggle('open');
  }

  function selectSymbol(symbol) {
    const input = document.getElementById('continueSymbol');
    input.value = symbol;
    saveSymbol();
    highlightActiveSymbol(symbol);
    // بستن باکس انتخاب
    document.getElementById('emojiPickerWrapper').classList.remove('open');
  }

  function highlightActiveSymbol(symbol) {
    const emojis = document.querySelectorAll('#emojiPicker span');
    emojis.forEach(el => {
      el.classList.toggle('active', el.textContent.trim() === symbol);
    });
  }

  function saveSymbol() {
    const symbol = document.getElementById('continueSymbol').value;
    localStorage.setItem('continueSymbol', symbol);
  }

  window.addEventListener('DOMContentLoaded', () => {
    const savedSymbol = localStorage.getItem('continueSymbol');
    if (savedSymbol) {
      document.getElementById('continueSymbol').value = savedSymbol;
      highlightActiveSymbol(savedSymbol);
    }
  });
  function applyTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.body.classList.toggle('dark', saved === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark');
    }
  }



  function shareTelegram(text) {
    const encoded = encodeURIComponent(text);
    const url = `https://t.me/share?url=${encoded}`;
    window.open(url, '_blank');
  }

  function shareWhatsApp(text) {
    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  }

  // ذخیره در لوکال‌استوریج در حین تایپ
  document.getElementById('inputText').addEventListener('input', function () {
    localStorage.setItem('savedText', this.value);
    updateLiveCounter(); // اگر شمارنده زنده هم داریم
  });

  // بازیابی متن ذخیره‌شده هنگام لود صفحه
  window.addEventListener('DOMContentLoaded', () => {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
      document.getElementById('inputText').value = savedText;
      updateLiveCounter(); // اگر شمارنده زنده داریم
    }

    // بازیابی سمبل ادامه هم‌زمان (اگر داری)
    const savedSymbol = localStorage.getItem('continueSymbol');
    if (savedSymbol) {
      document.getElementById('continueSymbol').value = savedSymbol;
      highlightActiveSymbol(savedSymbol);
    }
  });

  function clearSavedText() {
    localStorage.removeItem('savedText');
    document.getElementById('inputText').value = '';
    updateLiveCounter();
  }
function shareAllTweetsTelegram() {
  // بررسی وجود و معتبر بودن globalTweets
  if (!Array.isArray(globalTweets) || globalTweets.length === 0) {
    alert('هیچ توییتی برای اشتراک‌گذاری وجود ندارد!');
    return;
  }

  // ترکیب تمام توییت‌ها با فاصله بین آن‌ها
  let fullText = globalTweets.join('\n\n');

  // اگر متن خیلی بلند است، هشدار بده اما اجازه بده ارسال شود
  if (fullText.length > 4000) {
    const confirmSplit = confirm(
      'متن شما طولانی‌تر از ۴۰۰۰ کاراکتر است. ممکن است در تلگرام به‌طور کامل ارسال نشود. ادامه می‌دهید؟'
    );
    if (!confirmSplit) return;
  }

  // ساخت URL با پارامتر text (نه url)
  const telegramUrl = `https://t.me/share?url=${encodeURIComponent(fullText)}`;

  // باز کردن تلگرام
  window.open(telegramUrl, '_blank');
}

    function shareAllTweetsWhatsApp() {
      if (globalTweets.length === 0) return;
      const fullText = globalTweets.join('\n\n');
      const encoded = encodeURIComponent(fullText);
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    }




  window.addEventListener('DOMContentLoaded', applyTheme);

