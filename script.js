// ===== 打字机效果 =====
const typedText = document.getElementById('typed-text');
const commands = [
    'whoami',
    'cat skills.txt',
    'ls ./projects/',
    'echo "Hello, World!"',
    'git status'
];

let commandIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentCommand = commands[commandIndex];

    if (!isDeleting) {
        typedText.textContent = currentCommand.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentCommand.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2000);
            return;
        }
    } else {
        typedText.textContent = currentCommand.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
        }
    }

    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeWriter, typingSpeed);
}

// ===== 滚动入场动画 =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // 如果是项目区域，触发卡片的错落动画
            if (entry.target.querySelector('.projects-grid')) {
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }

            // 如果是统计区域，触发数字动画
            if (entry.target.querySelector('.stat-num')) {
                animateCounters(entry.target);
            }
        }
    });
}, observerOptions);

// 观察所有 section
document.querySelectorAll('.section').forEach((section) => {
    sectionObserver.observe(section);
});

// ===== 数字滚动动画 =====
function animateCounters(container) {
    const counters = container.querySelectorAll('.stat-num');

    counters.forEach((counter) => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';

        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

// ===== 导航栏平滑滚动增强 =====
document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 项目卡片点击交互 =====
document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', (e) => {
        // 如果点击的是按钮，不触发卡片整体效果
        if (e.target.closest('.btn')) return;

        const title = card.querySelector('.project-title')?.textContent || '项目';
        console.log(`[Clicked] ${title}`);
    });
});

// ===== 按钮点击反馈 =====
document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        console.log(`[Action] ${action}`);

        // 如果是占位链接，阻止跳转并给出提示
        const href = btn.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            showToast('🔧 链接待配置...');
        }

        // 如果是二维码按钮，显示弹窗
        if (action === 'qrcode') {
            e.preventDefault();
            showQrcodeModal();
        }
    });
});

// ===== 二维码弹窗功能 =====
function showQrcodeModal() {
    const modal = document.getElementById('qrcodeModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideQrcodeModal() {
    const modal = document.getElementById('qrcodeModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showOfficialQrcodeModal() {
    const modal = document.getElementById('officialQrcodeModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideOfficialQrcodeModal() {
    const modal = document.getElementById('officialQrcodeModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('qrcodeClose');
    const overlay = document.getElementById('qrcodeOverlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', hideQrcodeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', hideQrcodeModal);
    }

    const officialCloseBtn = document.getElementById('officialQrcodeClose');
    const officialOverlay = document.getElementById('officialQrcodeOverlay');
    const officialBtn = document.getElementById('officialQrcodeBtn');

    if (officialCloseBtn) {
        officialCloseBtn.addEventListener('click', hideOfficialQrcodeModal);
    }

    if (officialOverlay) {
        officialOverlay.addEventListener('click', hideOfficialQrcodeModal);
    }

    if (officialBtn) {
        officialBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOfficialQrcodeModal();
        });
    }

    // ESC 键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideQrcodeModal();
            hideOfficialQrcodeModal();
        }
    });
});

// ===== 轻量级 Toast 提示 =====
function showToast(message) {
    // 移除已存在的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--terminal-bg);
        color: var(--text-bright);
        padding: 12px 24px;
        border-radius: 8px;
        border: 1px solid var(--accent-green);
        font-family: var(--font-mono);
        font-size: 0.9rem;
        box-shadow: 0 10px 40px rgba(57, 211, 83, 0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ===== 键盘快捷键 =====
document.addEventListener('keydown', (e) => {
    // 'g' 键滚动到顶部
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ===== 随机彩蛋：在控制台输出欢迎信息 =====
console.log(
    '%c👋 欢迎来到我的个人主页！',
    'font-size: 18px; font-weight: bold; color: #39d353;'
);
console.log('%c提示：按 G 键可以快速回到顶部', 'color: #8b949e; font-size: 12px;');
console.log('%c$ ./explore --mode=interactive', 'color: #38bdf8; font-size: 12px;');

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    // 延迟启动打字机效果，让页面先加载
    setTimeout(() => {
        typeWriter();
    }, 800);

    // 确保 hero 下方的 section 在初始视口内能正确显示
    setTimeout(() => {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('visible');

                if (section.querySelector('.projects-grid')) {
                    const cards = section.querySelectorAll('.project-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => card.classList.add('visible'), index * 100);
                    });
                }

                if (section.querySelector('.stat-num')) {
                    animateCounters(section);
                }
            }
        });
    }, 300);
});
