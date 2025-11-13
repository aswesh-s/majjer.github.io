
document.addEventListener('DOMContentLoaded', function() {
    // Revenir en haut de la page au chargement/actualisation
    // S'assurer que la page commence en haut dès le début
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    
    // Forcer le scroll en haut immédiatement
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Au chargement complet de la page
    window.addEventListener('load', () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
    // Au DOMContentLoaded (avant le chargement complet)
    document.addEventListener('DOMContentLoaded', () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
    // Lors du rafraîchissement (F5 ou Ctrl+R)
    window.addEventListener('beforeunload', () => {
      window.scrollTo(0, 0);
    });
    
    const intro = document.querySelector(".intro");
    const nav = document.getElementById("majjerNav");
    const main = document.querySelector("main");
    const phoneImg = document.querySelector(".phone");

    let isIntroComplete = false;
    let lastScrollY = window.pageYOffset || 0;
    let navHideTimeout = null;
    let navIsHidden = false;
    const NAV_HIDE_DELAY = 140;
    const SCROLL_THRESHOLD = 2;

    function showNavbar() {
      if (!nav) return;
      if (navHideTimeout) {
        clearTimeout(navHideTimeout);
        navHideTimeout = null;
      }
      if (navIsHidden || !nav.classList.contains('nav-visible')) {
        nav.classList.add('nav-visible');
        nav.classList.remove('nav-hidden');
        navIsHidden = false;
      }
    }

    function hideNavbar() {
      if (!nav || navIsHidden) return;
      nav.classList.add('nav-hidden');
      nav.classList.remove('nav-visible');
      navIsHidden = true;
    }

    function scheduleHideNavbar() {
      if (navHideTimeout) return;
      navHideTimeout = setTimeout(() => {
        hideNavbar();
        navHideTimeout = null;
      }, NAV_HIDE_DELAY);
    }

    setTimeout(() => {
       intro.classList.add("hidden");
       nav.classList.add("visible");
       main.classList.add("visible");
       document.body.style.backgroundColor = "#000000";
 
       // ✅ Lance la rotation une seule fois, puis s'arrête
       phoneImg.style.animation = "RotatingPhone 2s ease-out forwards";
        
       // ✅ Afficher "meet Majjer" avec le titre principal
       const meetMajjer = document.querySelector('.meet-majjer');
       if (meetMajjer) {
         setTimeout(() => {
           meetMajjer.classList.add('show');
         }, 200);
       }
       showNavbar();
       isIntroComplete = true;
     }, 5500);

    // Gestion de l'apparition des bulles au scroll
    const textBubbles = document.querySelectorAll('.text-bubble');
    const phoneContainer = document.querySelector('.phone-container');
    
    // Timer pour détecter l'arrêt du scroll
    let scrollTimer = null;
    
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const containerTop = phoneContainer.offsetTop;
      const containerHeight = phoneContainer.offsetHeight;
      
      // Activer l'effet de brillance sur la navbar pendant le mouvement du scroll
      nav.classList.add('scrolling');
      
      // Réinitialiser le timer à chaque mouvement de scroll
      clearTimeout(scrollTimer);
      
      // Retirer l'effet de brillance après l'arrêt du scroll (150ms sans mouvement)
      scrollTimer = setTimeout(() => {
        nav.classList.remove('scrolling');
      }, 150);
      
      if (isIntroComplete) {
        const delta = scrollTop - lastScrollY;

        if (scrollTop <= 90) {
          showNavbar();
        } else if (delta > SCROLL_THRESHOLD) {
          scheduleHideNavbar();
        } else if (delta < -SCROLL_THRESHOLD) {
          showNavbar();
        }
      }

      lastScrollY = scrollTop;
      
      // Calculer la position relative du scroll par rapport au conteneur du téléphone
      const scrollInContainer = scrollTop + windowHeight - containerTop;
      const scrollProgress = Math.max(0, Math.min(1, scrollInContainer / (containerHeight + windowHeight)));

      textBubbles.forEach(bubble => {
        const triggerPoint = parseFloat(bubble.getAttribute('data-scroll'));
        
        if (scrollProgress >= triggerPoint - 0.1 && scrollProgress <= triggerPoint + 0.2) {
          bubble.classList.add('visible');
        } else {
          bubble.classList.remove('visible');
        }
      });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Vérifier au chargement

    // ========== SCROLL REVEAL SYSTEM ==========
    // Système générique d'animation au scroll pour tous les éléments
    // Ajoute automatiquement la classe .reveal aux éléments de chaque section
    
    const revealObserverOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    }, revealObserverOptions);

    // Ajouter automatiquement .reveal aux éléments pertinents
    function autoAddRevealClasses() {
      const EXCLUDE_SELECTORS = ['.text-bubble', '.cursor-glow', '.phone', '.team-inner'];
      document.querySelectorAll('main, section').forEach(container => {
        Array.from(container.children).forEach(child => {
          const skip = EXCLUDE_SELECTORS.some(sel => child.matches(sel));
          if (!skip && !child.classList.contains('reveal')) {
            child.classList.add('reveal');
          }
        });
      });
      // S'assurer que l'image de téléphone n'est jamais affectée
      document.querySelectorAll('.phone').forEach(el => {
        el.classList.remove('reveal', 'show');
      });
    }

    // Initialiser tous les éléments avec la classe .reveal
    function initScrollReveal() {
      const revealElements = document.querySelectorAll('.reveal:not(.phone)');
      revealElements.forEach(element => {
          revealObserver.observe(element);
      });
    }

    // Auto-tag + initialisation
    autoAddRevealClasses();
    // Fonction pour déclencher les animations après un scroll vers une section
    function triggerRevealOnSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        // Attendre que le scroll soit terminé
        const checkScroll = setInterval(() => {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Si la section est dans le viewport
          if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            clearInterval(checkScroll);
            const revealElements = section.querySelectorAll('.reveal');
            revealElements.forEach((element, index) => {
              setTimeout(() => {
                if (!element.classList.contains('show')) {
                  element.classList.add('show');
                }
              }, index * 100);
            });
          }
        }, 50);
        
        // Arrêter après 2 secondes maximum
        setTimeout(() => clearInterval(checkScroll), 2000);
      }
    }

    // Gérer les clics sur les liens de navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#')) {
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
          
          if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Déclencher les animations après le scroll
            triggerRevealOnSection(targetId);
            
            // Mettre à jour l'onglet actif
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
          }
        } else if (href === '#') {
          // Pour le lien Home
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Mettre à jour l'onglet actif en fonction de la section visible
    function updateActiveNavLink() {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
       // Retrieve the position of the features section
      const featuresSection = document.getElementById('features');
      const featuresTop = featuresSection ? featuresSection.offsetTop : Infinity;
       const pricingSection = document.getElementById('pricing');
       const pricingTop = pricingSection ? pricingSection.offsetTop : Infinity;
       const teamHeading = document.getElementById('team-vision') || document.getElementById('team');
       const teamTop = teamHeading ? teamHeading.offsetTop : Infinity;
      
      let currentSection = 'home';
      
       // Check pricing first since it sits below features
       const checkpoint = scrollPosition + windowHeight * 0.3;
       
       if (featuresSection && checkpoint >= featuresTop) {
        currentSection = 'features';
      }
      
       if (pricingSection && checkpoint >= pricingTop) {
         currentSection = 'pricing';
       }
       
       if (teamHeading && checkpoint >= teamTop) {
         currentSection = teamHeading.id;
       }
        
        // Update navigation bubbles
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' && currentSection === 'home') {
          link.classList.add('active');
        } else if (href === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }

    // Appeler updateActiveNavLink lors du scroll
    window.addEventListener('scroll', () => {
      updateActiveNavLink();
    });
    
    // Appeler au chargement
    updateActiveNavLink();

    // Initialiser au chargement
    initScrollReveal();

    // Réinitialiser après un certain délai pour s'assurer que tout est chargé
    setTimeout(() => {
      initScrollReveal();
    }, 1000);

    // Typewriter animation for "Built by/for students"
    const studentBuiltSection = document.getElementById('student-built');
    const typewriterWrapper = document.querySelector('.student-built-typewriter');

    if (studentBuiltSection && typewriterWrapper) {
      const textNode = typewriterWrapper.querySelector('.typewriter-text');
      const cursorNode = typewriterWrapper.querySelector('.typewriter-cursor');
      const firstPhrase = typewriterWrapper.dataset.first || '';
      const secondPhrase = typewriterWrapper.dataset.second || '';
      let typewriterStarted = false;
      let cycleTimeout = null;

      function typeWord(word, speed, done) {
        const target = word || '';
        cursorNode.classList.remove('typewriter-cursor--hold');

        if (target.length === 0) {
          textNode.textContent = '';
          if (typeof done === 'function') done();
          return;
        }

        let i = 0;
        function step() {
          textNode.textContent = target.substring(0, i + 1);
          i += 1;
          if (i < target.length) {
            setTimeout(step, speed);
          } else {
            textNode.textContent = target;
            if (typeof done === 'function') done();
          }
        }
        step();
      }

      function deleteWord(speed, done) {
        const current = textNode.textContent || '';
        let i = current.length;

        if (i === 0) {
          if (typeof done === 'function') done();
          return;
        }

        function step() {
          i -= 1;
          textNode.textContent = current.substring(0, i);
          if (i > 0) {
            setTimeout(step, speed);
          } else {
            textNode.textContent = '';
            if (typeof done === 'function') done();
          }
        }
        step();
      }

      function startTypewriter() {
        if (typewriterStarted) return;
        typewriterStarted = true;

        const phrases = [firstPhrase, secondPhrase].filter(Boolean);
        if (phrases.length === 0) return;

        let currentIndex = 0;

        function scheduleNextCycle(delay) {
          if (cycleTimeout) clearTimeout(cycleTimeout);
          cycleTimeout = setTimeout(() => {
            cycle();
          }, delay);
        }

        function cycle() {
          if (phrases.length <= 1) return;
          const nextIndex = (currentIndex + 1) % phrases.length;

          deleteWord(55, () => {
            typeWord(phrases[nextIndex], 85, () => {
              currentIndex = nextIndex;
              scheduleNextCycle(3000);
            });
          });
        }

        textNode.textContent = '';
        typeWord(phrases[0], 80, () => {
          if (phrases.length > 1) {
            scheduleNextCycle(3000);
          }
        });
      }

      const typewriterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startTypewriter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.55 });

      typewriterObserver.observe(studentBuiltSection);
    }

    // Effet de lumière qui suit le curseur
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.classList.add('active');
    });

    // Détecter le survol du téléphone pour intensifier l'effet
    phoneImg.addEventListener('mouseenter', () => {
      cursorGlow.classList.add('intensified');
    });

    phoneImg.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('intensified');
    });

    // Animation fluide pour suivre le curseur
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Masquer l'effet quand la souris quitte la page
    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
      cursorGlow.classList.remove('intensified');
    });

    // Gestion du curseur grab/grabbing pour le carrousel
    const featuresCarousel = document.querySelector('.features-cards-container');
    if (featuresCarousel) {
      let isDragging = false;
      
      featuresCarousel.addEventListener('mousedown', () => {
        isDragging = true;
        featuresCarousel.classList.add('dragging');
      });
      
      featuresCarousel.addEventListener('mouseup', () => {
        isDragging = false;
        featuresCarousel.classList.remove('dragging');
      });
      
      featuresCarousel.addEventListener('mouseleave', () => {
        isDragging = false;
        featuresCarousel.classList.remove('dragging');
      });
    }

    // --- Interactive swipe text handlers ---
    function attachSwipeHandlers(el, overlayColor) {
      if (!el) return;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        el.style.setProperty('--swipe-overlay', `radial-gradient(circle at var(--mx) var(--my), ${overlayColor} 0%, ${overlayColor} 15%, rgba(255,255,255,0) 30%)`);
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--swipe-overlay', 'none');
      });
    }

    // Attach to elements
    document.querySelectorAll('.swipe-white').forEach(el => attachSwipeHandlers(el, 'rgba(255,255,255,1)'));
    document.querySelectorAll('.swipe-orange').forEach(el => attachSwipeHandlers(el, 'rgba(255,122,0,1)'));

    const snapshotTrack = document.querySelector('.snapshot-track');
    if (snapshotTrack) {
      const slides = Array.from(snapshotTrack.children);
      const snapshotContainer = document.querySelector('.snapshot-track-container');
      const prevBtn = document.querySelector('.snapshot-nav-prev');
      const nextBtn = document.querySelector('.snapshot-nav-next');
      const dots = Array.from(document.querySelectorAll('.snapshot-dot'));
      const totalSlides = slides.length;
      let snapshotIndex = 0;
      let autoTimer = null;

      function updateSnapshotPosition() {
        if (!snapshotContainer) return;
        const slideHeight = snapshotContainer.offsetHeight;
        snapshotTrack.style.transform = `translateY(-${snapshotIndex * slideHeight}px)`;
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === snapshotIndex));
      }

      function goToSnapshot(index) {
        snapshotIndex = (index + totalSlides) % totalSlides;
        updateSnapshotPosition();
      }

      function startSnapshotAuto() {
        stopSnapshotAuto();
        autoTimer = setInterval(() => {
          goToSnapshot(snapshotIndex + 1);
        }, 6000);
      }

      function stopSnapshotAuto() {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      }

      prevBtn?.addEventListener('click', () => {
        goToSnapshot(snapshotIndex - 1);
        startSnapshotAuto();
      });

      nextBtn?.addEventListener('click', () => {
        goToSnapshot(snapshotIndex + 1);
        startSnapshotAuto();
      });

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          goToSnapshot(idx);
          startSnapshotAuto();
        });
      });

      window.addEventListener('resize', updateSnapshotPosition);

      goToSnapshot(0);
      startSnapshotAuto();
    }

    // Pricing toggle logic
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      const toggleButtons = Array.from(pricingSection.querySelectorAll('.pricing-toggle-btn'));
      const pricingCards = Array.from(pricingSection.querySelectorAll('.pricing-card'));

      function updatePlan(plan) {
        toggleButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.plan === plan));

        pricingCards.forEach(card => {
          const priceWrap = card.querySelector('.pricing-price');
          if (!priceWrap) return;
          const monthly = card.querySelector('.price-monthly');
          const annual = card.querySelector('.price-annual');
          const period = priceWrap.querySelector('.price-period');

          if (plan === 'annual') {
            monthly?.classList.remove('active');
            annual?.classList.add('active');
            if (period) period.textContent = priceWrap.dataset.periodAnnual || 'per year';
          } else {
            annual?.classList.remove('active');
            monthly?.classList.add('active');
            if (period) period.textContent = priceWrap.dataset.periodMonthly || 'per month';
          }
        });
      }

      toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.classList.contains('active')) return;
          updatePlan(btn.dataset.plan);
        });
      });

      updatePlan('monthly');
    }

    // Cursor glow effect that follows the pointer

    // Impact metrics count-up
    const impactSection = document.getElementById('impact');
    if (impactSection) {
      const metricValues = Array.from(impactSection.querySelectorAll('.metric-value'));
      const defaultValues = metricValues.map(el => el.dataset.prefix ? `${el.dataset.prefix}0${el.dataset.suffix || ''}` : `0${el.dataset.suffix || ''}`);

      function animateMetrics() {
        metricValues.forEach((valueEl, idx) => {
          const target = parseFloat(valueEl.dataset.target || '0');
          const prefix = valueEl.dataset.prefix || '';
          const suffix = valueEl.dataset.suffix || '';
          const decimals = parseInt(valueEl.dataset.decimals || '0', 10);
          const duration = 1500;
          const startTime = performance.now();

          function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = target * progress;
            const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current);
            valueEl.textContent = `${prefix}${formatted}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(update);
            }
          }

          requestAnimationFrame(update);
        });
      }

      const metricsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateMetrics();
          } else {
            metricValues.forEach((el, idx) => {
              el.textContent = defaultValues[idx];
            });
          }
        });
      }, { threshold: 0.4 });

      metricsObserver.observe(impactSection);
    }

    // Team connector stroke animation
    const teamSection = document.getElementById('team');
    if (teamSection) {
      const teamPath = teamSection.querySelector('.team-path');
      const teamCards = Array.from(teamSection.querySelectorAll('.team-card'));

      if (teamPath && teamCards.length) {
        const pathLength = teamPath.getTotalLength();
        teamPath.style.strokeDasharray = pathLength;
        teamPath.style.strokeDashoffset = pathLength;

        let currentOffset = pathLength;
        let currentProgress = 0;
        let isAnimating = false;
        const progressByCard = teamCards.map(card => parseFloat(card.dataset.pathProgress || '0'));

        function updateCardStates(progress) {
          teamCards.forEach((card, index) => {
            const cardProgress = progressByCard[index] ?? 0;
            if (progress >= cardProgress - 0.01) {
              card.classList.add('is-active');
            } else {
              card.classList.remove('is-active');
            }
          });
        }

        function animateStroke(targetProgress) {
          const targetOffset = pathLength * (1 - targetProgress);
          const startOffset = currentOffset;

          if (Math.abs(targetOffset - startOffset) < 0.5) {
            currentOffset = targetOffset;
            teamPath.style.strokeDashoffset = currentOffset;
            return;
          }

          const duration = 600;
          let startTime = null;
          isAnimating = true;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = startOffset + (targetOffset - startOffset) * eased;
            teamPath.style.strokeDashoffset = value;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              currentOffset = targetOffset;
              isAnimating = false;
            }
          }

          requestAnimationFrame(step);
        }

        function computeTargetProgress() {
          let target = 0;
          const triggerLine = window.innerHeight * 0.65;

          teamCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const progressValue = parseFloat(card.dataset.pathProgress || '0');
            if (rect.top <= triggerLine && !Number.isNaN(progressValue)) {
              const clamped = Math.max(0, Math.min(progressValue, 1));
              target = Math.max(target, clamped);
            }
          });

          if (Math.abs(target - currentProgress) > 0.01) {
            currentProgress = target;
            updateCardStates(currentProgress);
            animateStroke(target);
          } else if (!isAnimating) {
            const offset = pathLength * (1 - currentProgress);
            currentOffset = offset;
            teamPath.style.strokeDashoffset = offset;
            updateCardStates(currentProgress);
          }
        }

        let ticking = false;
        function onScroll() {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
              computeTargetProgress();
              ticking = false;
            });
          }
        }

        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', () => {
          teamPath.style.strokeDasharray = pathLength;
          currentOffset = pathLength * (1 - currentProgress);
          teamPath.style.strokeDashoffset = currentOffset;
          onScroll();
        });

        computeTargetProgress();
        updateCardStates(currentProgress);
      }
    }

  </script>
    

});
