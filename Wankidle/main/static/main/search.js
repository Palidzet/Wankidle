document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const videoList = document.getElementById('video-list');
    const form = document.querySelector('form');

    searchInput.addEventListener('input', function() {
        const query = searchInput.value;
        if (query.length > 0) {
            fetch(`/search_videos/?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    videoList.innerHTML = '';
                    data.forEach(video => {
                        const videoItem = document.createElement('div');
                        videoItem.innerHTML = `<a href="#" data-title="${video.title}">${video.title}</a>`;
                        videoList.appendChild(videoItem);
                    });

                    // Ajouter des gestionnaires de clic sur les nouveaux éléments
                    document.querySelectorAll('#video-list a').forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault(); // Empêcher la navigation par défaut
                            const title = event.target.getAttribute('data-title');
                            searchInput.value = title; // Remplir l'entrée de recherche avec le titre de la vidéo
                            form.submit(); // Soumettre le formulaire
                        });
                    });
                })
                .catch(error => console.error('Error:', error));
        } else {
            videoList.innerHTML = '';
        }
    });
});
