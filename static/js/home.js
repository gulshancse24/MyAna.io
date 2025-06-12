document.querySelector('a[href="#features"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#features').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});