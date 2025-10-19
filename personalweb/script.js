// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航链接处理
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // 为导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除所有链接的active类
            navLinks.forEach(item => item.classList.remove('active'));
            // 为当前点击的链接添加active类
            this.classList.add('active');
        });
    });
    
    // 监听滚动事件，动态更新导航栏高亮状态
    window.addEventListener('scroll', function() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });
    
    // 照片点击放大效果函数
    function addImageZoomEffect(elements, imagePaths) {
        elements.forEach((element, index) => {
            element.addEventListener('click', function() {
                // 创建放大视图
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';
                overlay.style.zIndex = '1000';
                overlay.style.cursor = 'pointer';
                overlay.style.transition = 'opacity 0.3s ease';
                
                const enlargedImg = document.createElement('img');
                enlargedImg.src = imagePaths[index];
                enlargedImg.style.maxWidth = '90%';
                enlargedImg.style.maxHeight = '90%';
                enlargedImg.style.borderRadius = '8px';
                enlargedImg.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.3)';
                enlargedImg.style.transition = 'transform 0.3s ease';
                
                overlay.appendChild(enlargedImg);
                document.body.appendChild(overlay);
                
                // 点击关闭放大视图
                overlay.addEventListener('click', function() {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(overlay);
                    }, 300);
                });
            });
        });
    }
    
    // 为小狗照片添加点击放大效果
    const petPhoto = document.querySelector('.pet-photo');
    if (petPhoto) {
        addImageZoomEffect([petPhoto], ['caramel.jpg']);
    }
    
    // 为生活照片添加点击放大效果
    const lifePhotos = document.querySelectorAll('.life-photo');
    if (lifePhotos.length > 0) {
        addImageZoomEffect(lifePhotos, ['life1.jpg', 'life2.jpg', 'life3.jpg']);
    }
    
    // 移除了项目详情按钮相关代码，因为按钮已被删除

// 书籍滑块功能
const slider = document.querySelector('.book-slider');
const prevBtn = document.querySelector('.slider-btn-prev');
const nextBtn = document.querySelector('.slider-btn-next');
let currentPosition = 0;

// 计算每本书的宽度（包括间距）并更新滑块
const updateSlider = () => {
    const bookItems = slider.querySelectorAll('.book-item');
    const bookWidth = bookItems[0].offsetWidth + 20; // 书本宽度 + 间距
    const visibleBooks = Math.floor(slider.parentElement.offsetWidth / bookWidth); // 动态计算可见书籍数量
    const maxPosition = Math.max(0, bookItems.length - visibleBooks);
    
    // 更新滑动函数
    const moveSlider = (direction) => {
        if (direction === 'next' && currentPosition < maxPosition) {
            currentPosition++;
        } else if (direction === 'prev' && currentPosition > 0) {
            currentPosition--;
        }
        slider.style.transform = `translateX(-${currentPosition * bookWidth}px)`;
    };
    
    // 重置位置以确保在有效范围内
    currentPosition = Math.min(currentPosition, maxPosition);
    slider.style.transform = `translateX(-${currentPosition * bookWidth}px)`;
    
    return moveSlider;
};

let moveSlider = updateSlider();

// 添加事件监听
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => moveSlider('prev'));
    nextBtn.addEventListener('click', () => moveSlider('next'));
}

// 窗口大小改变时重新计算
window.addEventListener('resize', () => {
    moveSlider = updateSlider();
});


    
    // 表单提交功能
function submitMessageForm(event) {
    event.preventDefault();
    
    // 获取表单数据
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // 简单验证
    if (!name || !email || !message) {
        alert('请填写所有必填字段');
        return false;
    }
    
    // 创建表单数据对象
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    
    // 发送请求
    fetch('/submit_message', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('留言提交成功！');
            // 重置表单
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        } else {
            alert('提交失败：' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('提交失败，请稍后重试');
    });
    
    return false;
}

// 表单提交事件
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', submitMessageForm);
}
    
    // 为技能进度条添加动画效果
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // 初始化技能进度条动画
    animateSkillBars();
    
    // 为图片添加点击放大效果
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(photo => {
        photo.addEventListener('click', function() {
            // 简单的放大效果
            this.style.transform = this.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
        });
    });
    
    // 响应式导航栏处理
    function handleResponsiveNav() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        function checkScreenSize() {
            if (window.innerWidth <= 480) {
                sidebar.style.position = 'relative';
                sidebar.style.height = 'auto';
                mainContent.style.marginLeft = '0';
            } else {
                sidebar.style.position = 'fixed';
                sidebar.style.height = '100vh';
                if (window.innerWidth <= 768) {
                    mainContent.style.marginLeft = '80px';
                } else {
                    mainContent.style.marginLeft = '250px';
                }
            }
        }
        
        // 初始检查
        checkScreenSize();
        
        // 监听窗口大小变化
        window.addEventListener('resize', checkScreenSize);
    }
    
    // 初始化响应式导航
    handleResponsiveNav();
    
    // 添加页面加载动画
    function pageLoadAnimation() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    }
    
    // 初始化页面加载动画
    pageLoadAnimation();
});