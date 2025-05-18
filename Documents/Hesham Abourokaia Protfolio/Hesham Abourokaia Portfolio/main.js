// Main JavaScript for Hesham (Sam) Abourokaia's portfolio website

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;
const loadingScreen = document.querySelector('.loading-screen');
const customCursor = document.querySelector('.custom-cursor');
const navbar = document.querySelector('.navbar');

// Loading animation
window.addEventListener('load', () => {
  setTimeout(() => {
    body.classList.add('loaded');
    initializeScrollAnimation();
    initializeCharts();
    initialize3DVisualization();
  }, 1500);
});

// Custom cursor
document.addEventListener('mousemove', (e) => {
  if (customCursor) {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  }
});

document.addEventListener('mousedown', () => {
  customCursor?.classList.add('active');
});

document.addEventListener('mouseup', () => {
  customCursor?.classList.remove('active');
});

// Intersection Observer for scroll animations
function initializeScrollAnimation() {
  const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stagger-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// 3D Tilt Effect
const tiltElements = document.querySelectorAll('.tilt-element');

tiltElements.forEach(element => {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;
    
    const xRotation = (yPercent - 0.5) * -20;
    const yRotation = (xPercent - 0.5) * 20;
    
    element.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// Theme switcher functionality
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  if (theme === 'dark') {
    themeIcon?.classList.replace('fa-moon', 'fa-sun');
  } else {
    themeIcon?.classList.replace('fa-sun', 'fa-moon');
  }
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Default to dark mode
  setTheme('dark');
}

// Theme toggle event listener
themeToggle?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Initialize Three.js 3D Enhanced Business Metrics Visualization
function initialize3DVisualization() {
  const threeContainer = document.getElementById('about-3d-visualization');
  if (!threeContainer) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
  renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
  renderer.setClearColor(0x121920, 0.2);
  threeContainer.appendChild(renderer.domElement);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);
  
  // Add point lights for highlights
  const pointLight1 = new THREE.PointLight(0x0063b0, 1, 100);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xc89b3c, 1, 100);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  // Create business metrics visualization - floating 3D bars with labels
  const metrics = [
    { label: "Data Analysis", value: 0.9, color: 0x0063b0 },
    { label: "Process Improvement", value: 0.85, color: 0x4b7bb2 },
    { label: "Business Intelligence", value: 0.82, color: 0xc89b3c },
    { label: "Communication", value: 0.88, color: 0x345b82 },
    { label: "Problem Solving", value: 0.92, color: 0x577fa8 }
  ];
  
  const barGroup = new THREE.Group();
  scene.add(barGroup);
  
  // Create 3D bars
  metrics.forEach((metric, index) => {
    const barHeight = metric.value * 5;
    const geometry = new THREE.BoxGeometry(1, barHeight, 1);
    
    // Create materials for a glowing effect
    const material = new THREE.MeshStandardMaterial({
      color: metric.color,
      metalness: 0.5,
      roughness: 0.2,
      emissive: metric.color,
      emissiveIntensity: 0.2
    });
    
    const bar = new THREE.Mesh(geometry, material);
    
    // Position bars in a circle
    const angle = (index / metrics.length) * Math.PI * 2;
    const radius = 4;
    bar.position.x = Math.cos(angle) * radius;
    bar.position.z = Math.sin(angle) * radius;
    bar.position.y = barHeight / 2;
    
    barGroup.add(bar);
    
    // Add floating label
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    context.fillStyle = '#ffffff';
    context.font = 'Bold 24px Arial';
    context.fillText(metric.label, 10, 64);
    context.fillStyle = 'rgba(200, 155, 60, 0.8)';
    context.font = '18px Arial';
    context.fillText(`${Math.round(metric.value * 100)}%`, 10, 90);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(bar.position.x, barHeight + 1, bar.position.z);
    sprite.scale.set(2, 1, 1);
    barGroup.add(sprite);
    
    // Add connecting line
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: metric.color,
      transparent: true,
      opacity: 0.6
    });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(bar.position.x, barHeight, bar.position.z),
      new THREE.Vector3(bar.position.x, barHeight + 0.8, bar.position.z)
    ]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    barGroup.add(line);
  });
  
  // Add central connecting sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xc89b3c,
    emissive: 0xc89b3c,
    emissiveIntensity: 0.2,
    shininess: 50
  });
  const centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  barGroup.add(centralSphere);
  
  // Add connecting lines from sphere to each bar
  metrics.forEach((metric, index) => {
    const angle = (index / metrics.length) * Math.PI * 2;
    const radius = 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: metric.color,
      transparent: true,
      opacity: 0.6
    });
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, 0, z)
    ]);
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    barGroup.add(line);
  });
  
  // Add particles for depth
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 200;
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Create particles in a sphere around the visualization
    const radius = 15;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta) - 2;
    posArray[i + 2] = radius * Math.cos(phi);
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    opacity: 0.4
  });
  
  const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleMesh);
  
  // Camera position
  camera.position.set(0, 7, 12);
  camera.lookAt(0, 0, 0);
  
  // Animation variables
  let rotationSpeed = 0.005;
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the entire visualization
    barGroup.rotation.y += rotationSpeed;
    
    // Subtle floating movement
    barGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    
    // Pulse the central sphere
    const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
    centralSphere.scale.set(scale, scale, scale);
    
    // Particles subtle movement
    particleMesh.rotation.y += rotationSpeed * 0.1;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
  });
}

// Initialize Charts
function initializeCharts() {
  // Skills Radar Chart
  const skillsRadarChart = document.getElementById('skillsRadarChart')?.getContext('2d');
  if (skillsRadarChart) {
    new Chart(skillsRadarChart, {
      type: 'radar',
      data: {
        labels: ['Data Analysis', 'SQL', 'Excel', 'Visio', 'R', 'Tableau', 'Power BI', 'Problem Solving'],
        datasets: [{
          label: 'Skills Proficiency',
          data: [90, 85, 95, 90, 75, 80, 80, 95],
          backgroundColor: 'rgba(0, 99, 176, 0.2)',
          borderColor: '#0063b0',
          borderWidth: 2,
          pointBackgroundColor: '#c89b3c',
          pointBorderColor: '#c89b3c',
          pointHoverBackgroundColor: '#c89b3c',
          pointHoverBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        scales: {
          r: {
            angleLines: {
              display: true,
              color: 'rgba(255, 255, 255, 0.1)'
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            pointLabels: {
              font: {
                family: 'Space Grotesk',
                size: 12
              },
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        },
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }

  // Experience Timeline Chart
  const timelineChart = document.getElementById('timelineChart')?.getContext('2d');
  if (timelineChart) {
    new Chart(timelineChart, {
      type: 'line',
      data: {
        labels: ['2003', '2005', '2007', '2009', '2011', '2013', '2015', '2017', '2019', '2021', '2023'],
        datasets: [{
          label: 'Career Growth',
          data: [30, 40, 40, 50, 60, 70, 75, 80, 85, 90, 95],
          fill: true,
          backgroundColor: 'rgba(200, 155, 60, 0.15)',
          borderColor: '#c89b3c',
          tension: 0.4,
          pointRadius: 7,
          pointBackgroundColor: '#0063b0',
          pointBorderColor: '#c89b3c',
          pointBorderWidth: 2,
          pointHoverRadius: 9,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#fd4aff',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Skill & Responsibility Level',
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 14
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year',
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 14
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + '%';
                }
                
                // Add position/achievement at each point
                const positions = [
                  'Computer Technician at Harvey Norman',
                  'Computer Technician at Quicknowledge',
                  'Transition Period',
                  'Early Career at Suncorp',
                  'Growing Responsibilities',
                  'Motor Claims Consultant at Suncorp',
                  'Customer Response Team Member',
                  'Led Team for Repeat Calls Project',
                  'Excel-Visio Integration Innovation',
                  'Advanced Data Analysis Projects',
                  'Business Analytics Certification'
                ];
                
                const pointIndex = context.dataIndex;
                if (positions[pointIndex]) {
                  label += ' - ' + positions[pointIndex];
                }
                
                return label;
              }
            },
            backgroundColor: 'rgba(10, 10, 16, 0.8)',
            titleFont: {
              family: 'Space Grotesk',
              size: 14
            },
            bodyFont: {
              family: 'Inter',
              size: 13
            },
            padding: 12,
            cornerRadius: 8,
            caretSize: 6
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        },
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }

  // Project Impact Chart
  const impactChart = document.getElementById('impactChart')?.getContext('2d');
  if (impactChart) {
    new Chart(impactChart, {
      type: 'bar',
      data: {
        labels: ['Process Improvement', 'Repeat Calls Reduction', 'Excel-Visio Integration', 'Data Analysis'],
        datasets: [{
          label: 'Impact Score',
          data: [85, 90, 75, 95],
          backgroundColor: [
            'rgba(0, 99, 176, 0.7)',
            'rgba(200, 155, 60, 0.7)',
            'rgba(75, 123, 178, 0.7)',
            'rgba(52, 91, 130, 0.7)'
          ],
          borderColor: [
            '#0063b0',
            '#c89b3c',
            '#4b7bb2',
            '#345b82'
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: [
            'rgba(0, 99, 176, 0.9)',
            'rgba(200, 155, 60, 0.9)',
            'rgba(75, 123, 178, 0.9)',
            'rgba(52, 91, 130, 0.9)'
          ]
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Impact Score',
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 14
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(10, 10, 16, 0.8)',
            titleFont: {
              family: 'Space Grotesk',
              size: 14
            },
            bodyFont: {
              family: 'Inter',
              size: 13
            },
            padding: 12,
            cornerRadius: 8,
            caretSize: 6
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        },
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }
}

// Handle form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    alert(`Thank you for your message, ${name}! I will get back to you as soon as possible.`);
    
    // Reset form
    contactForm.reset();
  });
}