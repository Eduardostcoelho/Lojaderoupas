// Pega todas as imagens dos produtos
    const imagens = document.querySelectorAll('.produto-imagem');

    imagens.forEach(img => {
        img.addEventListener('click', () => {
            const descricao = img.nextElementSibling; // pega o elemento logo após a imagem
            if (descricao && descricao.classList.contains('descricao-produto')) {
                descricao.style.display = (descricao.style.display === 'block') ? 'none' : 'block';
            }
        });
    });

    