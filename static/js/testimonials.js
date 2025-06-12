document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('testimonialModal');
    const addBtn = document.getElementById('addTestimonialBtn');
    const closeBtn = document.querySelector('.close-modal');
    const testimonialForm = document.getElementById('testimonialForm');
    const testimonialsList = document.getElementById('testimonialsList');
    const ratingStars = document.querySelectorAll('.rating-star');
    let selectedRating = 0;

    // Show modal
    addBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Handle rating stars
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStars();
        });

        star.addEventListener('mouseover', () => {
            highlightStars(parseInt(star.dataset.rating));
        });

        star.addEventListener('mouseout', () => {
            highlightStars(selectedRating);
        });
    });

    // Handle form submission
    testimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedRating) {
            alert('Please select a rating');
            return;
        }

        const formData = {
            name: testimonialForm.name.value,
            message: testimonialForm.message.value,
            rating: selectedRating
        };

        try {
            const response = await fetch('/api/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                modal.classList.remove('show');
                testimonialForm.reset();
                selectedRating = 0;
                updateStars();
                loadTestimonials();
                alert('Testimonial added successfully!');
            } else {
                alert(data.message || 'Failed to add testimonial');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    function updateStars() {
        ratingStars.forEach(star => {
            const rating = parseInt(star.dataset.rating);
            star.classList.toggle('active', rating <= selectedRating);
        });
    }

    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('active', starRating <= rating);
        });
    }

    // Load existing testimonials
    loadTestimonials();
});

async function loadTestimonials() {
    const testimonialsList = document.getElementById('testimonialsList');
    
    try {
        const response = await fetch('/api/testimonials');
        const testimonials = await response.json();

        if (testimonialsList) {
            testimonialsList.innerHTML = testimonials.length ? testimonials.map(t => `
                <div class="testimonial-card" data-aos="fade-up">
                    <div class="testimonial-rating">
                        ${Array(5).fill(0).map((_, i) => 
                            `<i class="fas fa-star ${i < t.rating ? 'active' : ''}"></i>`
                        ).join('')}
                    </div>
                    <p class="testimonial-text">${t.message}</p>
                    <div class="testimonial-author">
                        <div class="author-info">
                            <div class="author-name">${t.name}</div>
                            <div class="author-date">
                                ${new Date(t.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('') : '<p class="no-testimonials">No testimonials yet</p>';
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}