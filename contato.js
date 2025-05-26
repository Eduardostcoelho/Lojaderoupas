document.addEventListener('DOMContentLoaded', function() {
            // Seleciona todos os inputs e textareas dentro de .input-container
            const formElements = document.querySelectorAll('.input-container input, .input-container textarea');

            formElements.forEach(element => {
                // Ao carregar a página, se o campo já tiver valor (ex: preenchimento automático), ativa o label
                if (element.value !== '') {
                    element.parentNode.classList.add('active');
                }

                // Quando o campo recebe foco
                element.addEventListener('focus', () => {
                    element.parentNode.classList.add('active');
                });

                // Quando o campo perde o foco
                element.addEventListener('blur', () => {
                    // Se o campo estiver vazio, remove a classe 'active'
                    if (element.value === '') {
                        element.parentNode.classList.remove('active');
                    }
                });
            });
        });