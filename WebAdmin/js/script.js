document.addEventListener("DOMContentLoaded", () => {

    // ========================== SIDEBAR ACTIVE ==========================
    const sideLinks = document.querySelectorAll("#sidebar .side-menu.top li a");

    sideLinks.forEach(a => {
        a.addEventListener("click", () => {
            sideLinks.forEach(i => i.parentElement.classList.remove("active"));
            a.parentElement.classList.add("active");
        });
    });


    // ========================== TOGGLE SIDEBAR ==========================
    const menuBtn = document.querySelector("#content nav .bx.bx-menu");
    const sidebar = document.getElementById("sidebar");

    menuBtn?.addEventListener("click", () => {
        sidebar?.classList.toggle("hide");
    });


    // ========================== SEARCH MOBILE ==========================
    const searchBtn = document.querySelector('#content nav form .form-input button');
    const searchIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector("#content nav form");

    searchBtn?.addEventListener("click", e => {
        if (window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle("show");

            searchIcon.classList.toggle("bx-x");
            searchIcon.classList.toggle("bx-search");
        }
    });

    const resetSearchState = () => {
        if (window.innerWidth > 576) {
            searchIcon?.classList.remove("bx-x");
            searchIcon?.classList.add("bx-search");
            searchForm?.classList.remove("show");
        }
    };

    if (window.innerWidth < 768) sidebar?.classList.add("hide");
    resetSearchState();
    window.addEventListener("resize", resetSearchState);


    // ========================== DARK MODE ==========================
    const switchMode = document.getElementById("switch-mode");

    switchMode?.addEventListener("change", function () {
        document.body.classList.toggle("dark", this.checked);
    });



    // =====================================================================
    // ========================== SERVICE CRUD =============================
    // =====================================================================

    const modal = document.getElementById("addModal");
    const btnOpen = document.getElementById("openAddModal");
    const btnClose = document.getElementById("closeAddModal");
    const btnSave = document.getElementById("saveService");
    const serviceTable = document.getElementById("serviceTable");
    const editIndex = document.getElementById("editIndex");
    const modalTitle = document.getElementById("modalTitle");

    const getServiceInputs = () => ({
        name: document.getElementById("serviceName"),
        price: document.getElementById("servicePrice"),
        desc: document.getElementById("serviceDesc")
    });

    const clearServiceInputs = () => {
        const { name, price, desc } = getServiceInputs();
        if (name) name.value = "";
        if (price) price.value = "";
        if (desc) desc.value = "";
    };

    const closeServiceModal = () => {
        if (modal) {
            modal.classList.add("hidden");
            modal.style.display = "none";
        }
        if (editIndex) editIndex.value = "";
        clearServiceInputs();
    };

    // Open Modal
    btnOpen?.addEventListener("click", () => {
        if (modal) {
            modal.classList.remove("hidden");
            modal.style.display = "flex";
        }
        if (modalTitle) modalTitle.textContent = "Thêm Dịch Vụ Mới";
        clearServiceInputs();
        if (editIndex) editIndex.value = "";
    });

    // Close Modal
    btnClose?.addEventListener("click", closeServiceModal);

    // Save Service
    btnSave?.addEventListener("click", () => {
        const { name, price, desc } = getServiceInputs();

        const sName = name?.value.trim() || "";
        const sPrice = price?.value.trim() || "";
        const sDesc = desc?.value.trim() || "";

        if (!sName || !sPrice) {
            alert("Vui lòng nhập tên và giá dịch vụ!");
            return;
        }

        const index = editIndex?.value || "";

        // UPDATE
        if (index !== "" && serviceTable) {
            const row = serviceTable.rows[index];
            if (row) {
                row.cells[0].textContent = sName;
                row.cells[1].textContent = sPrice;
                row.cells[2].textContent = sDesc;
            }
            closeServiceModal();
            return;
        }

        // ADD NEW
        if (serviceTable) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${sName}</td>
                <td>${sPrice}</td>
                <td>${sDesc}</td>
                <td>
                    <button class="edit-btn">Sửa</button>
                    <button class="delete-btn">Xóa</button>
                </td>
            `;
            serviceTable.appendChild(tr);
        }

        closeServiceModal();
    });

    // Click Outside Modal
    modal?.addEventListener("click", e => {
        if (e.target === modal) closeServiceModal();
    });

    // Edit & Delete Events
    serviceTable?.addEventListener("click", e => {
        const btn = e.target;

        if (btn.classList.contains("delete-btn")) {
            if (confirm("Xóa dịch vụ này?")) {
                btn.closest("tr")?.remove();
            }
            return;
        }

        if (btn.classList.contains("edit-btn")) {
            const row = btn.closest("tr");
            if (!row || !serviceTable) return;
            
            const index = [...serviceTable.rows].indexOf(row);

            const { name, price, desc } = getServiceInputs();
            if (name) name.value = row.cells[0]?.textContent || "";
            if (price) price.value = row.cells[1]?.textContent || "";
            if (desc) desc.value = row.cells[2]?.textContent || "";

            if (editIndex) editIndex.value = index;
            if (modalTitle) modalTitle.textContent = "Sửa Dịch Vụ";
            if (modal) {
                modal.classList.remove("hidden");
                modal.style.display = "flex";
            }
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
            closeServiceModal();
        }
    });





    const doctorModal = document.getElementById("doctorModal");
    const btnAddDoctor = document.getElementById("btnAddDoctor");
    const btnCancel = document.getElementById("btnCancel");
    const doctorForm = document.getElementById("doctorForm");
    const doctorTable = document.querySelector("#doctorTable tbody");

    let editDoctor = -1;

    const clearDoctorForm = () => {
        ["name", "specialty", "phone", "email", "image"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    };

    const filterDoctors = () => {
        if (!doctorTable) return;
        const searchDoctor = document.getElementById("searchDoctor");
        if (!searchDoctor) return;

        const keyword = searchDoctor.value.toUpperCase();

        [...doctorTable.rows].forEach(row => {
            const t = row.textContent.toUpperCase();
            row.style.display = t.includes(keyword) ? "" : "none";
        });
    };

    // Initial Fake Doctors
    function initDoctors() {
        if (!doctorTable || doctorTable.rows.length > 0) return;

        const list = [
            { image: "img/people.png", name: "Trần Văn A", specialty: "Khám tổng quát", phone: "0901234567" },
            { image: "img/people.png", name: "Lê Thị B", specialty: "Tiêm phòng", phone: "0908765432" },
            { image: "img/people.png", name: "Nguyễn Văn C", specialty: "Cắt Tỉa Lông", phone: "0912345678" }
        ];

        list.forEach(d => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${d.image}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;"></td>
                <td>${d.name}</td>
                <td>${d.specialty}</td>
                <td>${d.phone}</td>
                <td>
                    <button class="status completed edit-doctor-btn">Sửa</button>
                    <button class="status pending delete-doctor-btn">Xóa</button>
                </td>
            `;
            doctorTable.appendChild(tr);
        });
    }

    btnAddDoctor?.addEventListener("click", () => {
        if (doctorModal) {
            doctorModal.style.display = "flex";
            const modalTitleEl = document.getElementById("modalTitle");
            if (modalTitleEl) modalTitleEl.textContent = "Thêm Bác Sĩ";
            editDoctor = -1;
            clearDoctorForm();
        }
    });

    btnCancel?.addEventListener("click", () => {
        if (doctorModal) {
            doctorModal.style.display = "none";
        }
    });

    doctorForm?.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const specialty = document.getElementById("specialty")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const email = document.getElementById("email")?.value.trim() || "";
        let image = document.getElementById("image")?.value.trim() || "img/people.png";

        if (!name || !specialty || !phone) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
            return;
        }

        if (!doctorTable) return;

        // UPDATE
        if (editDoctor >= 0) {
            const row = doctorTable.rows[editDoctor];
            row.cells[0].innerHTML = `<img src="${image}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">`;
            row.cells[1].textContent = name;
            row.cells[2].textContent = specialty;
            row.cells[3].textContent = phone;
        } else {
            // ADD NEW
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${image}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;"></td>
                <td>${name}</td>
                <td>${specialty}</td>
                <td>${phone}</td>
                <td>
                    <button class="status completed edit-doctor-btn">Sửa</button>
                    <button class="status pending delete-doctor-btn">Xóa</button>
                </td>
            `;
            doctorTable.appendChild(tr);
        }

        if (doctorModal) doctorModal.style.display = "none";
        filterDoctors();
    });

    // Edit/Delete doctor
    doctorTable?.addEventListener("click", e => {
        const btn = e.target;

        if (btn.classList.contains("delete-doctor-btn")) {
            if (confirm("Xóa bác sĩ?")) btn.closest("tr").remove();
            filterDoctors();
            return;
        }

        if (btn.classList.contains("edit-doctor-btn")) {
            const row = btn.closest("tr");
            editDoctor = [...doctorTable.rows].indexOf(row);

            const nameEl = document.getElementById("name");
            const specialtyEl = document.getElementById("specialty");
            const phoneEl = document.getElementById("phone");
            const imageEl = document.getElementById("image");
            const modalTitleEl = document.getElementById("modalTitle");

            if (nameEl) nameEl.value = row.cells[1].textContent;
            if (specialtyEl) specialtyEl.value = row.cells[2].textContent;
            if (phoneEl) phoneEl.value = row.cells[3].textContent;
            if (imageEl) imageEl.value = row.cells[0].querySelector("img")?.src || "";
            if (modalTitleEl) modalTitleEl.textContent = "Sửa Thông Tin Bác Sĩ";
            
            if (doctorModal) doctorModal.style.display = "flex";
        }
    });

    const searchDoctorInput = document.getElementById("searchDoctor");
    searchDoctorInput?.addEventListener("keyup", filterDoctors);

    doctorModal?.addEventListener("click", e => {
        if (e.target === doctorModal) {
            doctorModal.style.display = "none";
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && doctorModal?.style.display === "flex") {
            doctorModal.style.display = "none";
        }
    });

    // Initialize default doctors
    initDoctors();


    // =====================================================================
    // ========================== APPOINTMENTS =============================
    // =====================================================================

    const appointmentTable = document.getElementById("appointmentTable");
    if (appointmentTable) {
        let appointments = [
            {
                date: "2024-01-15",
                time: "09:00",
                pet: "Milo",
                owner: "Nguyễn Văn A",
                service: "Khám tổng quát",
                doctor: "BS. Nguyễn Văn A",
                status: "accepted"
            },
            {
                date: "2024-01-15",
                time: "10:30",
                pet: "Luna",
                owner: "Trần Thị B",
                service: "Tiêm phòng",
                doctor: "BS. Trần Thị B",
                status: "pending"
            },
            {
                date: "2024-01-15",
                time: "14:00",
                pet: "Max",
                owner: "Lê Văn C",
                service: "Phẫu thuật",
                doctor: "BS. Lê Văn C",
                status: "completed"
            }
        ];

        const statusBadge = {
            accepted: `<span class="status completed">Đã xác nhận</span>`,
            pending: `<span class="status pending">Chờ xác nhận</span>`,
            completed: `<span class="status completed">Hoàn thành</span>`
        };

        function renderAppointments() {
            appointmentTable.innerHTML = "";

            appointments.forEach((a, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${a.pet}</td>
                    <td>${a.owner}</td>
                    <td>${a.service}</td>
                    <td>${a.doctor}</td>
                    <td>${statusBadge[a.status]}</td>
                    <td><a href="#" class="details">Chi tiết</a></td>
                `;
                appointmentTable.appendChild(tr);
            });

            updateAppointmentStats();
        }

        function updateAppointmentStats() {
            const today = "2024-01-15";

            const todayEl = document.getElementById("todayCount");
            const weekEl = document.getElementById("weekCount");
            const pendingEl = document.getElementById("pendingCount");

            if (todayEl) todayEl.textContent = appointments.filter(a => a.date === today).length;
            if (weekEl) weekEl.textContent = appointments.length;
            if (pendingEl) pendingEl.textContent = appointments.filter(a => a.status === "pending").length;
        }

        const searchAppointment = document.getElementById("searchAppointment");
        searchAppointment?.addEventListener("keyup", () => {
            const key = searchAppointment.value.toLowerCase();

            [...appointmentTable.rows].forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(key) ? "" : "none";
            });
        });

        renderAppointments();
    }


    // =====================================================================
    // ========================== BLOG MANAGEMENT ==========================
    // =====================================================================

    const addBlogBtn = document.querySelector('.add-btn');
    const blogModal = document.getElementById('addBlogModal');
    const closeBlogModalBtn = document.getElementById('closeModalBtn');
    const saveBlogBtn = document.getElementById('saveBlogBtn');
    const blogList = document.querySelector('.blog-list');

    // Mở modal khi click nút "Viết bài mới"
    addBlogBtn?.addEventListener('click', () => {
        blogModal.style.display = 'flex';
        // Reset form
        document.getElementById('blogTitle').value = '';
        document.getElementById('blogAuthor').value = '';
        document.getElementById('blogDate').value = '';
        document.getElementById('blogContent').value = '';
        document.getElementById('blogStatus').value = 'published';
    });

    // Đóng modal
    closeBlogModalBtn?.addEventListener('click', () => {
        blogModal.style.display = 'none';
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            blogModal.style.display = 'none';
        }
    });

    // Lưu bài viết mới
    saveBlogBtn?.addEventListener('click', () => {
        const title = document.getElementById('blogTitle').value.trim();
        const author = document.getElementById('blogAuthor').value.trim();
        const date = document.getElementById('blogDate').value;
        const content = document.getElementById('blogContent').value.trim();
        const status = document.getElementById('blogStatus').value;

        // Validate dữ liệu
        if (!title) {
            alert('Vui lòng nhập tiêu đề bài viết!');
            return;
        }
        if (!author) {
            alert('Vui lòng nhập tên tác giả!');
            return;
        }
        if (!date) {
            alert('Vui lòng chọn ngày đăng!');
            return;
        }
        if (!content) {
            alert('Vui lòng nhập nội dung bài viết!');
            return;
        }

        // Format ngày từ yyyy-mm-dd sang dd/mm/yyyy
        const dateObj = new Date(date);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

        // Tạo card blog mới
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';
        
        const statusClass = status === 'published' ? 'status-published' : 'status-draft';
        const statusText = status === 'published' ? 'Đã xuất bản' : 'Nháp';
        
        blogCard.innerHTML = `
            <div class="blog-title">${title}</div>
            <div class="blog-footer">
                <div class="blog-info">
                    <span>${author}</span>
                    <span>• ${formattedDate}</span>
                    <span>• 👁 0 lượt xem</span>
                </div>
                <div class="${statusClass}">${statusText}</div>
                <div class="action-icons">
                    <i class='bx bx-edit'></i>
                    <i class='bx bx-trash'></i>
                </div>
            </div>
        `;

        // Thêm sự kiện cho nút xóa
        const deleteBtn = blogCard.querySelector('.bx-trash');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
                blogCard.remove();
                updateBlogStats();
            }
        });

        // Thêm sự kiện cho nút sửa
        const editBtn = blogCard.querySelector('.bx-edit');
        editBtn.addEventListener('click', () => {
            alert('Chức năng chỉnh sửa đang được phát triển!');
        });

        // Thêm card vào đầu danh sách
        if (blogList) {
            blogList.insertBefore(blogCard, blogList.firstChild);
        }

        // Cập nhật thống kê
        updateBlogStats();

        // Đóng modal
        blogModal.style.display = 'none';

        // Thông báo thành công
        alert('Đã thêm bài viết mới thành công!');
    });

    // Cập nhật số liệu thống kê blog
    function updateBlogStats() {
        const allBlogs = document.querySelectorAll('.blog-card');
        const publishedBlogs = document.querySelectorAll('.status-published');
        
        const statsItems = document.querySelectorAll('.stats-item h2');
        if (statsItems.length >= 2) {
            statsItems[0].textContent = allBlogs.length;
            statsItems[1].textContent = publishedBlogs.length;
        }
    }

    // Thêm chức năng xóa cho các blog có sẵn
    document.querySelectorAll('.blog-card .bx-trash').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
                this.closest('.blog-card').remove();
                updateBlogStats();
            }
        });
    });

    // Thêm chức năng sửa cho các blog có sẵn
    document.querySelectorAll('.blog-card .bx-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Chức năng chỉnh sửa đang được phát triển!');
        });
    });

    // Tìm kiếm blog
    const searchBlogInput = document.getElementById('searchDoctor');
    if (searchBlogInput && blogList) {
        searchBlogInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const blogCards = document.querySelectorAll('.blog-card');
            
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
                const author = card.querySelector('.blog-info span')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // =====================================================================
    // ========================== USER ACCOUNT MANAGEMENT ==================
    // =====================================================================

    const userModal = document.getElementById("userModal");
    const btnAddUser = document.querySelector(".btn-add");
    const btnCancelUser = document.querySelector(".btn-cancel");
    const btnSaveUser = document.querySelector(".btn-save");
    const userTableBody = document.querySelector(".table tbody");
    const searchUserInput = document.querySelector(".table-search");
    const filterRoleSelect = document.querySelector(".select");
    // const menuBtn = document.querySelector(".menu-btn");

    // Toggle Sidebar
    menuBtn?.addEventListener("click", () => {
        const sidebar = document.getElementById("sidebar");
        sidebar?.classList.toggle("hide");
    });

    let users = [
        {
            name: "Nguyễn Văn A",
            role: "Bác Sĩ",
            status: "active",
            date: "12-11-2025",
            email: "nguyenvana@clinic.com",
            phone: "0901234567"
        },
        {
            name: "Trần Thị B",
            role: "Nhân Viên",
            status: "inactive",
            date: "10-10-2025",
            email: "tranthib@clinic.com",
            phone: "0908765432"
        },
        {
            name: "Lê Văn C",
            role: "Bác Sĩ",
            status: "active",
            date: "05-09-2025",
            email: "levanc@clinic.com",
            phone: "0912345678"
        },
        {
            name: "Phạm Thị D",
            role: "Nhân Viên",
            status: "active",
            date: "01-08-2025",
            email: "phamthid@clinic.com",
            phone: "0923456789"
        }
    ];

    let editingUserIndex = -1;

    // Render User Table
    function renderUsers(filteredUsers = users) {
        if (!userTableBody) return;

        userTableBody.innerHTML = "";

        filteredUsers.forEach((user, index) => {
            const statusClass = user.status === "active" ? "active" : user.status === "inactive" ? "inactive" : "locked";
            const statusText = user.status === "active" ? "Đang hoạt động" : user.status === "inactive" ? "Bị khóa" : "Tạm khóa";
            
            const roleClass = user.role === "Bác Sĩ" ? "doctor" : user.role === "Nhân Viên" ? "staff" : "admin";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.name}</td>
                <td><span class="user-role ${roleClass}">${user.role}</span></td>
                <td><span class="user-status ${statusClass}">${statusText}</span></td>
                <td>${user.date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" data-index="${index}">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="action-btn delete" data-index="${index}">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                        <button class="action-btn lock" data-index="${index}">
                            <span class="material-symbols-outlined">${user.status === "active" ? "lock" : "lock_open"}</span>
                        </button>
                    </div>
                </td>
            `;
            userTableBody.appendChild(tr);
        });

        // Add event listeners to action buttons
        attachActionListeners();
    }

    // Attach event listeners to action buttons
    function attachActionListeners() {
        // Edit buttons
        document.querySelectorAll(".action-btn.edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.dataset.index;
                editUser(parseInt(index));
            });
        });

        // Delete buttons
        document.querySelectorAll(".action-btn.delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.dataset.index;
                deleteUser(parseInt(index));
            });
        });

        // Lock/Unlock buttons
        document.querySelectorAll(".action-btn.lock").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.dataset.index;
                toggleUserStatus(parseInt(index));
            });
        });
    }

    // Edit User
    function editUser(index) {
        if (!userModal) return;
        
        const user = users[index];
        editingUserIndex = index;

        const modalTitle = userModal.querySelector("h2");
        if (modalTitle) modalTitle.textContent = "Sửa Thông Tin Tài Khoản";

        const nameEl = document.getElementById("userName");
        const emailEl = document.getElementById("userEmail");
        const phoneEl = document.getElementById("userPhone");
        const roleEl = document.getElementById("userRole");
        const passwordEl = document.getElementById("userPassword");

        if (nameEl) nameEl.value = user.name;
        if (emailEl) emailEl.value = user.email;
        if (phoneEl) phoneEl.value = user.phone;
        if (roleEl) roleEl.value = user.role;
        if (passwordEl) passwordEl.value = "";

        userModal.style.display = "flex";
    }

    // Delete User
    function deleteUser(index) {
        if (confirm(`Bạn có chắc muốn xóa tài khoản "${users[index].name}"?`)) {
            users.splice(index, 1);
            renderUsers();
        }
    }

    // Toggle User Status (Lock/Unlock)
    function toggleUserStatus(index) {
        const user = users[index];
        user.status = user.status === "active" ? "inactive" : "active";
        renderUsers();
    }

    // Open Add User Modal
    btnAddUser?.addEventListener("click", () => {
        if (!userModal) return;
        
        userModal.style.display = "flex";
        const modalTitle = userModal.querySelector("h2");
        if (modalTitle) modalTitle.textContent = "Thêm Tài Khoản Mới";
        
        editingUserIndex = -1;
        clearUserForm();
    });

    // Close User Modal
    btnCancelUser?.addEventListener("click", () => {
        if (userModal) userModal.style.display = "none";
    });

    // Clear User Form
    function clearUserForm() {
        ["userName", "userEmail", "userPhone", "userRole", "userPassword"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    }

    // Save User
    btnSaveUser?.addEventListener("click", () => {
        const name = document.getElementById("userName")?.value.trim();
        const email = document.getElementById("userEmail")?.value.trim();
        const phone = document.getElementById("userPhone")?.value.trim();
        const role = document.getElementById("userRole")?.value;
        const password = document.getElementById("userPassword")?.value;

        if (!name || !email || !phone || !role) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (editingUserIndex === -1 && !password) {
            alert("Vui lòng nhập mật khẩu cho tài khoản mới!");
            return;
        }

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

        const newUser = {
            name,
            role,
            status: "active",
            date: formattedDate,
            email,
            phone
        };

        // Update
        if (editingUserIndex >= 0) {
            users[editingUserIndex] = { ...users[editingUserIndex], ...newUser };
        } else {
            // Add new
            users.push(newUser);
        }

        renderUsers();
        if (userModal) userModal.style.display = "none";
        alert(editingUserIndex >= 0 ? "Cập nhật tài khoản thành công!" : "Thêm tài khoản mới thành công!");
    });

    // Search Users
    searchUserInput?.addEventListener("input", () => {
        const keyword = searchUserInput.value.toLowerCase();
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            user.phone.includes(keyword)
        );
        renderUsers(filtered);
    });

    // Filter by Role
    filterRoleSelect?.addEventListener("change", () => {
        const role = filterRoleSelect.value;
        if (role === "Tất cả chức vụ") {
            renderUsers(users);
        } else {
            const filtered = users.filter(user => user.role === role);
            renderUsers(filtered);
        }
    });

    // Click outside modal
    userModal?.addEventListener("click", (e) => {
        if (e.target === userModal) {
            userModal.style.display = "none";
        }
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && userModal?.style.display === "flex") {
            userModal.style.display = "none";
        }
    });

    // Initialize
    renderUsers();

    // =====================================================================
    // ========================== CUSTOMER MANAGEMENT ======================
    // =====================================================================

    const customerModal = document.getElementById("customerModal");
    const detailModal = document.getElementById("detailModal");
    const btnAddCustomer = document.getElementById("btnAddCustomer");
    const btnCancelCustomer = document.getElementById("btnCancelCustomer");
    const closeCustomerModal = document.getElementById("closeCustomerModal");
    const btnCloseDetail = document.getElementById("btnCloseDetail");
    const customerForm = document.getElementById("customerForm");
    const customerTableBody = document.getElementById("customerTableBody");
    const searchCustomerInput = document.getElementById("searchInput");
    const filterGender = document.getElementById("filterGender");
    const filterStatus = document.getElementById("filterStatus");
    const customerModalTitle = document.getElementById("customerModalTitle");

    let customers = [
        {
            id: "KH001",
            name: "Nguyễn Văn An",
            gender: "Nam",
            birthday: "15/03/1985",
            phone: "0901234567",
            address: "123 Nguyễn Huệ, Q.1, TP.HCM",
            email: "nguyenvanan@gmail.com",
            status: "Đã khỏi",
            lastVisit: "20/11/2025",
            note: "Tiền sử dị ứng thuốc kháng sinh"
        },
        {
            id: "KH002",
            name: "Trần Thị Bình",
            gender: "Nữ",
            birthday: "22/07/1990",
            phone: "0912345678",
            address: "456 Lê Lợi, Q.3, TP.HCM",
            email: "tranthib@gmail.com",
            status: "Đang điều trị",
            lastVisit: "22/11/2025",
            note: ""
        },
        {
            id: "KH003",
            name: "Lê Hoàng Cường",
            gender: "Nam",
            birthday: "10/12/1978",
            phone: "0923456789",
            address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
            email: "lehoangcuong@gmail.com",
            status: "Tái khám",
            lastVisit: "18/11/2025",
            note: "Kiểm tra định kỳ 6 tháng/lần"
        }
    ];

    let editingCustomerIndex = -1;

    // Render Customer Table
    function renderCustomers(filteredCustomers = customers) {
        if (!customerTableBody) return;

        customerTableBody.innerHTML = "";

        filteredCustomers.forEach((customer, index) => {
            let statusClass = "done";
            if (customer.status === "Đang điều trị") statusClass = "pending";
            else if (customer.status === "Tái khám") statusClass = "success";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${customer.id}</strong></td>
                <td>${customer.name}</td>
                <td>${customer.gender}</td>
                <td>${customer.birthday}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td><span class="status ${statusClass}">${customer.status}</span></td>
                <td>${customer.lastVisit}</td>
                <td>
                    <div class="action-icons" style="justify-content: center;">
                        <i class='bx bx-show view' title="Xem chi tiết" data-index="${index}"></i>
                        <i class='bx bx-edit edit' title="Chỉnh sửa" data-index="${index}"></i>
                        <i class='bx bx-trash delete' title="Xóa" data-index="${index}"></i>
                    </div>
                </td>
            `;
            customerTableBody.appendChild(tr);
        });

        // Attach event listeners
        attachCustomerActions();
    }

    // Attach Customer Action Listeners
    function attachCustomerActions() {
        // View
        document.querySelectorAll(".action-icons .view").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                viewCustomerDetail(index);
            });
        });

        // Edit
        document.querySelectorAll(".action-icons .edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                editCustomer(index);
            });
        });

        // Delete
        document.querySelectorAll(".action-icons .delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                deleteCustomer(index);
            });
        });
    }

    // View Customer Detail
    function viewCustomerDetail(index) {
        const customer = customers[index];
        const detailContent = document.getElementById("customerDetail");

        detailContent.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Mã khách hàng</div>
                    <div class="detail-value">${customer.id}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Trạng thái</div>
                    <div class="detail-value"><span class="status ${customer.status === 'Đã khỏi' ? 'done' : customer.status === 'Đang điều trị' ? 'pending' : 'success'}">${customer.status}</span></div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Họ và tên</div>
                    <div class="detail-value">${customer.name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Giới tính</div>
                    <div class="detail-value">${customer.gender}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ngày sinh</div>
                    <div class="detail-value">${customer.birthday}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Số điện thoại</div>
                    <div class="detail-value">${customer.phone}</div>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${customer.email}</div>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-label">Địa chỉ</div>
                    <div class="detail-value">${customer.address}</div>
                </div>
                ${customer.note ? `
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-label">Ghi chú</div>
                    <div class="detail-value">${customer.note}</div>
                </div>
                ` : ''}
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-label">Lịch sử khám</div>
                    <ul class="history-list">
                        <li class="history-item">
                            <div class="history-date">${customer.lastVisit}</div>
                            <div class="history-details">Khám tổng quát - BS. Nguyễn Văn A</div>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        if (detailModal) detailModal.style.display = "flex";
    }

    // Edit Customer
    function editCustomer(index) {
        const customer = customers[index];
        editingCustomerIndex = index;

        if (customerModalTitle) customerModalTitle.textContent = "Chỉnh Sửa Khách Hàng";

        // Fill form
        const nameEl = document.getElementById("customerName");
        const genderEl = document.getElementById("customerGender");
        const phoneEl = document.getElementById("customerPhone");
        const birthdayEl = document.getElementById("customerBirthday");
        const emailEl = document.getElementById("customerEmail");
        const addressEl = document.getElementById("customerAddress");
        const noteEl = document.getElementById("customerNote");

        if (nameEl) nameEl.value = customer.name;
        if (genderEl) genderEl.value = customer.gender;
        if (phoneEl) phoneEl.value = customer.phone;
        
        // Convert birthday from dd/mm/yyyy to yyyy-mm-dd
        const [day, month, year] = customer.birthday.split('/');
        if (birthdayEl) birthdayEl.value = `${year}-${month}-${day}`;
        
        if (emailEl) emailEl.value = customer.email;
        if (addressEl) addressEl.value = customer.address;
        if (noteEl) noteEl.value = customer.note;

        if (customerModal) customerModal.style.display = "flex";
    }

    // Delete Customer
    function deleteCustomer(index) {
        const customer = customers[index];
        if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.name}"?`)) {
            customers.splice(index, 1);
            renderCustomers();
            alert("Khách hàng đã được xóa!");
        }
    }

    // Open Add Customer Modal
    btnAddCustomer?.addEventListener("click", () => {
        if (customerModalTitle) customerModalTitle.textContent = "Thêm Khách Hàng Mới";
        editingCustomerIndex = -1;
        
        if (customerForm) customerForm.reset();
        if (customerModal) customerModal.style.display = "flex";
    });

    // Close Modals
    btnCancelCustomer?.addEventListener("click", () => {
        if (customerModal) customerModal.style.display = "none";
    });

    closeCustomerModal?.addEventListener("click", () => {
        if (customerModal) customerModal.style.display = "none";
    });

    btnCloseDetail?.addEventListener("click", () => {
        if (detailModal) detailModal.style.display = "none";
    });

    // Click outside to close
    customerModal?.addEventListener("click", (e) => {
        if (e.target === customerModal) {
            customerModal.style.display = "none";
        }
    });

    detailModal?.addEventListener("click", (e) => {
        if (e.target === detailModal) {
            detailModal.style.display = "none";
        }
    });

    // Submit Customer Form
    customerForm?.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("customerName")?.value.trim();
        const gender = document.getElementById("customerGender")?.value;
        const phone = document.getElementById("customerPhone")?.value.trim();
        const birthday = document.getElementById("customerBirthday")?.value;
        const email = document.getElementById("customerEmail")?.value.trim();
        const address = document.getElementById("customerAddress")?.value.trim();
        const note = document.getElementById("customerNote")?.value.trim();

        if (!name || !gender || !phone || !birthday || !address) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
            return;
        }

        // Convert birthday from yyyy-mm-dd to dd/mm/yyyy
        const [year, month, day] = birthday.split('-');
        const formattedBirthday = `${day}/${month}/${year}`;

        // Current date for lastVisit
        const today = new Date();
        const lastVisit = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

        if (editingCustomerIndex >= 0) {
            // Update existing customer
            customers[editingCustomerIndex] = {
                ...customers[editingCustomerIndex],
                name,
                gender,
                phone,
                birthday: formattedBirthday,
                email,
                address,
                note
            };
            alert("Cập nhật khách hàng thành công!");
        } else {
            // Add new customer
            const newId = `KH${String(customers.length + 1).padStart(3, '0')}`;
            const newCustomer = {
                id: newId,
                name,
                gender,
                birthday: formattedBirthday,
                phone,
                address,
                email,
                status: "Đã khỏi",
                lastVisit,
                note
            };
            customers.push(newCustomer);
            alert("Thêm khách hàng mới thành công!");
        }

        renderCustomers();
        if (customerModal) customerModal.style.display = "none";
        if (customerForm) customerForm.reset();
    });

    // Search Customers
    searchCustomerInput?.addEventListener("input", () => {
        const keyword = searchCustomerInput.value.toLowerCase();
        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(keyword) ||
            customer.phone.includes(keyword) ||
            customer.id.toLowerCase().includes(keyword)
        );
        renderCustomers(filtered);
    });

    // Filter by Gender
    filterGender?.addEventListener("change", () => {
        applyFilters();
    });

    // Filter by Status
    filterStatus?.addEventListener("change", () => {
        applyFilters();
    });

    // Apply all filters
    function applyFilters() {
        const searchValue = searchCustomerInput?.value.toLowerCase() || "";
        const genderValue = filterGender?.value || "";
        const statusValue = filterStatus?.value || "";

        const filtered = customers.filter(customer => {
            const matchSearch = customer.name.toLowerCase().includes(searchValue) ||
                              customer.phone.includes(searchValue) ||
                              customer.id.toLowerCase().includes(searchValue);
            const matchGender = !genderValue || customer.gender === genderValue;
            const matchStatus = !statusValue || customer.status === statusValue;

            return matchSearch && matchGender && matchStatus;
        });

        renderCustomers(filtered);
    }

    // ESC to close modals
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (customerModal?.style.display === "flex") {
                customerModal.style.display = "none";
            }
            if (detailModal?.style.display === "flex") {
                detailModal.style.display = "none";
            }
        }
    });

    // Initialize customers
    renderCustomers();

});
// ========================== DOCTOR CARDS =============================
// =====================================================================

const doctorModal2 = document.getElementById("doctorModal");
const btnAddDoctor2 = document.getElementById("btnAddDoctor");
const btnCancel2 = document.getElementById("btnCancel");
const doctorForm2 = document.getElementById("doctorForm");
const doctorList = document.getElementById("doctorList");
const searchDoctor2 = document.getElementById("searchDoctor");

let doctors = [];
let editingIndex = -1;

// Render Doctor Cards
function renderDoctors() {
    if (!doctorList) return;
    
    doctorList.innerHTML = "";

    doctors.forEach((d, index) => {
        const initials = d.name.split(" ").map(w => w[0]).join("").slice(-2).toUpperCase();

        const card = document.createElement("div");
        card.className = "doctor-card";

        card.innerHTML = `
            <div class="card-actions">
                <i class='bx bx-edit edit' data-index="${index}"></i>
                <i class='bx bx-trash delete' data-index="${index}"></i>
            </div>

            <div class="doctor-avatar">${initials}</div>

            <h3>BS. ${d.name}</h3>
            <p style="color:#777; margin-top: -5px;">${d.specialty}</p>

            <div class="info-row">
                <i class='bx bx-envelope'></i> ${d.email}
            </div>

            <div class="info-row">
                <i class='bx bx-phone'></i> ${d.phone}
            </div>
        `;

        doctorList.appendChild(card);
    });
}

// Open Add Modal
btnAddDoctor2?.addEventListener("click", () => {
    doctorModal2.style.display = "flex";
    const modalTitleEl = document.getElementById("modalTitle");
    if (modalTitleEl) modalTitleEl.textContent = "Thêm Bác Sĩ";
    editingIndex = -1;

    ["name", "specialty", "email", "phone"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
});

// Close Modal
btnCancel2?.addEventListener("click", () => {
    doctorModal2.style.display = "none";
});

// Save Doctor
doctorForm2?.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const specialty = document.getElementById("specialty")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();

    if (!name || !specialty || !email || !phone) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const newDoctor = { name, specialty, email, phone };

    // Update
    if (editingIndex >= 0) {
        doctors[editingIndex] = newDoctor;
    } else {
        // Add new
        doctors.push(newDoctor);
    }

    renderDoctors();
    doctorModal2.style.display = "none";
});

// Card Click Actions
doctorList?.addEventListener("click", e => {
    const btn = e.target;

    // Delete Doctor
    if (btn.classList.contains("delete")) {
        const i = btn.dataset.index;
        if (confirm("Xóa bác sĩ này?")) {
            doctors.splice(i, 1);
            renderDoctors();
        }
        return;
    }

    // Edit Doctor
    if (btn.classList.contains("edit")) {
        const i = btn.dataset.index;
        const d = doctors[i];

        editingIndex = i;

        const modalTitleEl = document.getElementById("modalTitle");
        if (modalTitleEl) modalTitleEl.textContent = "Sửa Bác Sĩ";
        
        const nameEl = document.getElementById("name");
        const specialtyEl = document.getElementById("specialty");
        const emailEl = document.getElementById("email");
        const phoneEl = document.getElementById("phone");
        
        if (nameEl) nameEl.value = d.name;
        if (specialtyEl) specialtyEl.value = d.specialty;
        if (emailEl) emailEl.value = d.email;
        if (phoneEl) phoneEl.value = d.phone;

        doctorModal2.style.display = "flex";
    }
});

// Search Doctor
searchDoctor2?.addEventListener("keyup", () => {
    const keyword = searchDoctor2.value.toLowerCase();

    if (doctorList) {
        [...doctorList.children].forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(keyword) ? "" : "none";
        });
    }
});

// Click outside modal
doctorModal2?.addEventListener("click", e => {
    if (e.target === doctorModal2) doctorModal2.style.display = "none";
});

// ESC close
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && doctorModal2?.style.display === "flex") {
        doctorModal2.style.display = "none";
    }
});

// Initialize doctors
doctors = [
    { name: "Nguyễn Văn A", specialty: "Khám tổng quát", email: "nguyenvana@vetcare.com", phone: "0901234567" },
    { name: "Trần Thị B", specialty: "Tiêm Phòng", email: "tranthib@vetcare.com", phone: "0908765432" },
    { name: "Lê Văn C", specialty: "Cắt tỉa lông", email: "levanc@vetcare.com", phone: "0912345678" }
];

renderDoctors();