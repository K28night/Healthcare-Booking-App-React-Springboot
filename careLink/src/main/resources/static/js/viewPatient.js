$(document).ready(function () {
    $('.search').focus();

    // Load doctors into search dropdown
    $.ajax({
        url: "/doctorlist",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const select = $("#searchDoctor");
            data.forEach(doc => {
                select.append($("<option></option>")
                    .attr("value", doc.id)
                    .text(doc.name));
            });
        },
        error: function (xhr, status, error) {
            console.error("Error loading doctors:", error);
        }
    });

    // Load patients initially sorted by name
    $.ajax({
        url: "/displayall",
        type: "GET",
        dataType: "json",
        data: { sort: "name" },
        success: function (patients) {
            const tbody = $('#patientTableBody');
            tbody.empty();
            loadPatientData(patients);
        },
        error: function (xhr, status, error) {
            console.error("Error loading patients:", error);
        }
    });

    // Filter/Search from backend
    $('.search, #searchDate, #searchDoctor, #searchStatus,#Sort,#Slot').on('input change', function () {
        // const filters = {
        //     search: ($('.search').val())?$('.search').val().trim():'',
        //     date: ($('#searchDate').val())?$('#searchDate').val():'',
        //     doctor: ($('#searchDoctor').val().trim())?$('#searchDoctor').val().trim():'',
        //     status: ($('#searchStatus').val())?$('#searchStatus').val():''
        // };
        let rawStatus = $('#searchStatus').val().trim();
        let slot = $('#Slot').val();
        if (slot == "") {
            slot = null;
        }
        let status = null;

        if (rawStatus === "true") {
            status = true;
        } else if (rawStatus === "false") {
            status = false;
        } else {
            status = ""; // important: remove the field when it's "All Status"
        }
        $.ajax({
            url: "/search",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                name: $('.search').val().trim(),
                date: $('#searchDate').val(),
                doctor: { id: $('#searchDoctor').val().trim() },
                status: status,
                code: $('#Sort').val(),
                timeSlot: slot
            }),

            success: function (patients) {
                $('#patientTableBody').empty();
                loadPatientData(patients);
            },
            error: function () {
                alert("Error filtering patients");
            }
        });
    });

    // Sorting by dropdown
    // $('#Sort').change(function () {
    //     const sort = $(this).val();
    //     $.ajax({
    //         url: "/displayall",
    //         type: "GET",
    //         dataType: "json",
    //         data: { sort: sort },
    //         success: function (patients) {
    //             const tbody = $('#patientTableBody');
    //             tbody.empty();
    //             loadPatientData(patients);
    //         },
    //         error: function (xhr, status, error) {
    //             console.error("Error loading patients:", error);
    //         }
    //     });
});

// Delete patient
$(document).on('click', '.delete-btn', function () {
    const btn = $(this);
    const patientId = btn.data('id');
    const patientName = btn.data('name');

    if (confirm(`Are you sure you want to delete ${patientName} patient?`)) {
        $.ajax({
            url: `/delete/${patientId}`,
            type: "GET",
            success: function () {
                btn.closest('tr').remove();
                alert("Patient deleted successfully.");
            },
            error: function (xhr, status, error) {
                console.error("Error deleting patient:", error);
            }
        });
    }
});

// Edit patient
$(document).on('click', '.edit-btn', function () {
    const patientId = $(this).data('id');
    const patientName = $(this).data('name');

    if (confirm(`Are you sure you want to edit ${patientName} patient?`)) {
        window.location.href = `/addPatient.html?id=${patientId}`;
    }
});


// Reusable function to render table rows
function loadPatientData(patients) {
    const tbody = $('#patientTableBody');
    patients.forEach((p, i) => {
        const doctorName = p.doctor?.name || '';
        const statusClass = p.status ? 'active' : 'inactive';
        const statusText = p.status ? 'Booked' : 'Waiting List';

        const row = `
            <tr data-doctor="${doctorName}">
                <td>${i + 1}</td>
                <td>${p.name}</td>
                <td>${p.code}</td>
                <td>${p.mobileNumber}</td>
                <td>${doctorName}</td>
                <td>${p.date}</td>
                <td>${p.timeSlot}</td>
                 <td>${p.fees}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                 
                <td class="action-btns">
                    <button class="action-btn edit-btn" data-id="${p.id}" data-name="${p.name}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${p.id}" data-name="${p.name}">Delete</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}
