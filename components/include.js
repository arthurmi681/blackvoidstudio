document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-include]').forEach(function (el) {
        var file = el.getAttribute('data-include');
        fetch(file)
            .then(function (res) {
                if (!res.ok) throw new Error('Arquivo não encontrado: ' + file);
                return res.text();
            })
            .then(function (html) { el.innerHTML = html; })
            .catch(function (err) { console.error('[include]', err); });
    });
});