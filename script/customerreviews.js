function Main_10() {

const stars = document.querySelectorAll('.star-rating span');
let selectedRating = 0;

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        if (selectedRating === index + 1) {
            selectedRating = 0;
        } else {
            selectedRating = index + 1;
        }
        highlightStars(selectedRating);
    });

    star.addEventListener('mouseover', () => highlightStars(index + 1));
    star.addEventListener('mouseout', () => highlightStars(selectedRating));
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const username = document.getElementById('username').value;
    const reviewText = document.getElementById('reviewText').value;
    const reviewsDisplay = document.getElementById('reviewsDisplay');

    if (username && reviewText && selectedRating > 0) {
        const review = document.createElement('div');
        review.classList.add('review');

        const nameElement = document.createElement('p');
        nameElement.classList.add('username');
        nameElement.textContent = username;

        const starsElement = document.createElement('div');
        starsElement.classList.add('stars');

        for (let i = 1; i <= 5; i++) {
            const starChar = document.createElement('span');
            starChar.textContent = i <= selectedRating ? '★' : '☆';
            starsElement.appendChild(starChar);
        }

        const reviewTextElement = document.createElement('p');
        reviewTextElement.classList.add('review-text');
        reviewTextElement.textContent = reviewText;

        review.appendChild(nameElement);
        review.appendChild(starsElement);
        review.appendChild(reviewTextElement);

        reviewsDisplay.appendChild(review);

        document.getElementById('username').value = '';
        document.getElementById('reviewText').value = '';
        highlightStars(0);
        selectedRating = 0;
    } else {
        alert('Please fill out all fields and select a star rating.');
    }
}
}