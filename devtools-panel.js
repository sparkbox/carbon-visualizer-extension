document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('button').addEventListener('click', () => {
    document.getElementById('output').textContent = 'Hello world!';
  });
});