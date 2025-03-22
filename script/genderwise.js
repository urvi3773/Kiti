const gallery = document.getElementById('gallery');
        let position = 0;
        const itemSize = 220; // Width of each gallery item including gap

        function scrollRight() {
            if (position <= gallery.scrollWidth - gallery.offsetWidth - itemSize) {
                position += itemSize;
                gallery.style.transform = `translateX(-${position}px)`;
            }
        }

        function scrollLeft() {
            if (position > 0) {
                position -= itemSize;
                gallery.style.transform = `translateX(-${position}px)`;
            }
        }