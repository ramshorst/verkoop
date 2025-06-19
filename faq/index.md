---
layout: page
lang: en
title: Frequently Asked Questions
---

<div class="faq-container">
  {% for faq in site.data.faq %}
  <div class="faq-item">
    <div class="faq-question" onclick="toggleFaq(this)">
      <h3>{{ faq.question[page.lang] }}</h3>
      <span class="faq-toggle">+</span>
    </div>
    <div class="faq-answer">
      <p>{{ faq.answer[page.lang] }}</p>
    </div>
  </div>
  {% endfor %}
</div>

<script>
function toggleFaq(element) {
  const faqItem = element.parentElement;
  const answer = faqItem.querySelector('.faq-answer');
  const toggle = element.querySelector('.faq-toggle');
  
  faqItem.classList.toggle('active');
  
  if (faqItem.classList.contains('active')) {
    toggle.textContent = '−';
  } else {
    toggle.textContent = '+';
  }
}
</script>