let patientId = null;
let slotAvailable = false;
let codeValide=false;
$(document).ready(function () {
    $('.name').focus();

   $('#formSubmit').addClass('disabled-button');
    $('#status').prop("checked", false);
    $('#status').prop("disabled", true);
    $.ajax({
        url: "/doctorlist",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = $("#doctorSelect");
            // let depart = $('#departmentSelect');
            // const addedDepartments = new Set();
            $.each(data, function (index, doc) {
                select.append($("<option></option>")
                    .attr("value", doc.id)
                    .text(doc.name + "(" + doc.department + ")"));
                // if (!addedDepartments.has(doc.department)) {
                //     addedDepartments.add(doc.department);
                //     depart.append($("<option></option>")
                //         .attr("value", doc.department)
                //         .text(doc.department));
                // }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error loading doctors:", error);
        }
    });

    $('.su').click(function(){

    });

    $('#checkAvailability').on('click', function () {
        const date = $('#date').val();
      
        const doctorid = $('#doctorSelect').val();
        const doctorId = parseInt(doctorid);
        const slot = $('#slotSelect').val();


        if (!date ||  !doctorId || !slot) {
          
            $('#availabilityMessage').css({
                "color": " red",
                "font-family": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                "opacity": " 0.85"
            }).text("Please select Date, Slot, and Doctor");

        } else {
            $.ajax({
                url: '/checkAvailability',
                type: 'POST',
                 contentType: 'application/x-www-form-urlencoded',
                data: {
                    dates: date,
                    slots: slot,
                    doctorId: doctorId

                }
                ,
                success: function (res) {
                   
                    $('#availabilityMessage').text(res.message);

                    if (res.body.available === true) {
                        $('#availabilityMessage').css({
                            "color": " green",
                            "font-family": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            "opacity": " 0.85"
                        }).text("slot is available");
                      
                           $('#status').prop("checked", true);
                        $('#status').prop("disabled", true);
                        $('#alternativeSlots').hide();
                           $('#formSubmit').removeClass('disabled-button');
                       
                        slotAvailable=true;
                    } else if (res.body.waitingList) {
                       
                        $('#availabilityMessage').css({
                            "color": " red",
                            "font-family": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            "opacity": " 0.85"
                        }).text("slot is not available You are in waiting list");
                        $('#statusError').text("Waiting List")
                        $('#status').prop("checked", false);
                        $('#status').prop("disabled", true);
                        $('#alternativeSlots').hide();
                        slotAvailable=true;
                        
                           $('#formSubmit').removeClass('disabled-button');
                    } else {
                        $('#availabilityMessage').css({
                            "color": " green",
                            "font-family": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            "opacity": " 0.85"
                        }).text("Select a slot");
                       
                           $('#formSubmit').addClass('disabled-button');
                           $('#status').prop("checked", false);
                        $('#status').prop("disabled", true);
                        slotAvailable=false;
                        renderSlotTable(res.body.alternatives);
                        $('#alternativeSlots').show();
                    }
                },
                error: function (error) {
                    $('#availabilityMessage').text("Error checking slot. Please try again."+error).css('color', 'red').css('font-size', '14px').show();
                }
            });
        }
    });


    const urlParams = new URLSearchParams(window.location.search);
    patientId = urlParams.get('id');

    if (patientId) {
        
        $('#formSubmit').text('Add Patient');
        $('.Clear').text('Cancel');
        loadPatientData(patientId);
    }
});
$('.name').on('input', function () {
    const nameReg = /^[A-Za-z\s]+$/;
    if ($(this).val().trim() === '') {
        $('#nameError').text('Name is required');
        $('#nameError').css('color', 'red');
    }
    else if ($('.name').val().length < 3 || !nameReg.test($('.name').val())) {
        $('#nameError').text('Enter valid name');
        $('#nameError').css('color', 'red');
    }
    else {
        $('#nameError').text('Enter full name (e.g., John Doe)').removeAttr('style');
        $('#nameError').addClass('.hint');

    }
});

$('#code').on('input', function () {
    const code = $(this).val();
const codeReg = /^P\d{3,}$/;


    if (code.trim() === '') {
        $('#codeError').text('Code is required').css('color', 'red');
    } else if (!codeReg.test(code)) {
        $('#codeError').text('Invalid format. Use P followed by 3 digits (e.g., P101)').css('color', 'red').css('opacity', '0.7');
    } else if (patientId == null) {//validation for adding...

        $.get('/validate', { code: code }, function (isValid) {
            if (!isValid) {
                $('#codeError').text('Code already exists').css('color', 'red');
            } else {
                codeValide=true;
                $('#codeError').text('Code is available').css('color', 'green');
            }
        });
    }
    else {//while updating
        $.get('/codeValidation', { id: patientId, code: code }, function (isValide) {
            if (!isValide) {
                $('#codeError').text('Code ia already exsists').css('color', 'red');
            }
            else {
                codeValide=true;
                $('#codeError').text('Start with "P" followed by digits (e.g., P101)').removeAttr('style').addClass('hint');
            }
        });
    }
});
$('.date').on('change', function () {
    const date = new Date($(this).val());
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
      $('#status').prop("checked", false);
    $('#status').prop("disabled", true);
    if (date < today) {
        $('#dateError').text('Admission date cannot be in the past.').css('color', 'red');
    } else {
        $('#dateError').text('Choose admission or registration date').removeAttr('style').addClass('hint');
    }
});
$('.phone').on('input', function () {
    const phone = $(this).val().trim();
    const phoneRex = /^[6-9]\d{9}$/;
    if (!phoneRex.test(phone)) {
        $('#phoneError').text('Enter valid 10-digit mobile number.').css('color', 'red');
    }
    else {
        $('#phoneError').text('10-digit mobile number (e.g., 9876543210).').removeAttr('style').addClass('hint');
    }
});
$('#doctorSelect').on('change',function(){
       $('#status').prop("checked", false);
    $('#status').prop("disabled", true);
})
$('#addPatientForm').submit(function (e) {
    e.preventDefault();
     if (!slotAvailable) {
      e.preventDefault(); 
      $('#formError').text("Please check slot availability first.").css("color", "red").show();
    }
    let isValid = true;

    const name = $('.name').val().trim();
    const code = $('.code').val().trim();
    const phone = $('.phone').val().trim();
    const dateStr = $('.date').val();
    const fees = $('.fees').val().trim();
    const doctor = $('#doctorSelect').val();
    const slot = $('#slotSelect').val().trim();


    // Name validation
    if (!/^[A-Za-z\s]{3,}$/.test(name)) {
        $('#nameError').text('Enter a valid name (min 3 letters)').css('color', 'red');
        isValid = false;
    } else {
        $('#nameError').text('Enter full name (e.g., John Doe)').removeAttr('style').addClass('hind');
    }

   // Code format check
    const codeReg = /^P\d+$/;
    if (!codeReg.test(code)) {
        $('#codeError').text('Use format P followed by digits (e.g., P101)').css('color', 'red');
        isValid = false;
    } else {
        // Check code availability if adding new
        if (!patientId) {
         $.get('/validate', { code: code }, function (exists) {
                if (!exists) {
                    $('#codeError').text('Code already exists').css('color', 'red');
                    isValid = false;
                }
            });
        } else {
             $.get('/codeValidation', { id: patientId, code: code }, function (isValidCode) {
                if (!isValidCode) {
                    $('#codeError').text('Code already exists').css('color', 'red');
                    isValid = false;
                }
            });
        }
    }
   

    // Phone validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
        $('#phoneError').text('Enter valid 10-digit mobile number').css('color', 'red');
        isValid = false;
    } else {
        $('#phoneError').text('10-digit mobile number (e.g., 9876543210)').removeAttr('style').addClass('hint');
    }
      if (!slotAvailable) {
        $('#formError').text("Please check slot availability first.").css("color", "red").show();
        return;
    }

    // Date validation
    const date = new Date(dateStr);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (!dateStr || date < today) {
        $('#dateError').text('Date must not be empty or in the past').css('color', 'red');
        isValid = false;
    } else {
        $('#dateError').text('Choose admission or registration date').removeAttr('style').addClass('hint');
    }

    // Fees validation
    if (isNaN(fees) || Number(fees) <= 0) {
        $('#feesError').text('Enter a valid amount').css('color', 'red');
        isValid = false;
    } else {
        $('#feesError').removeAttr('style').text('Minimum ₹350, numeric only').addClass('hint');
    }

    // Doctor validation
    if (!doctor) {
        $('#doctorError').text('Please select a doctor').css('color', 'red');
        isValid = false;
    } else {
        $('#doctorError').removeAttr('style').text('Please assign a consulting doctor').addClass('hint');
    }

    // if (!($('.status').is(':checked')) && patientId == null) {//status will only none when updating
    //     isValid = false;
    //     $('#statusError').text('Status must be active').css('color','red')
    // } else {
    //     $('#statusError').removeAttr('style').text('Checked = Active').addClass('hint');
    // }
    if (!slot) {
        $('#slotError').text('Please select a slot').css('color', 'red');
        isValid = false;
    } else {
        $('#slotError').removeAttr('style').text('Please assign a time slot').addClass('hint');
    }

    if (!isValid) {
        $('#formError').text("Please fix the errors before submitting").css('color', 'red');
        return;
    }

    // All valid — submit AJAX
    const patientData = {
        name,
        code,
        date: dateStr,
        fees,
        mobileNumber: phone,
        doctor: { id: doctor },
        status: $('.status').is(':checked'),
        timeSlot: slot,
    };
    if (patientId == null) {//adding new patient ..
        $.ajax({
            url: "/savepatient",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(patientData),
            success: function () {
                alert("Patient saved successfully!");
                location.reload();
            },
            error: function () {
                $('#formError').text("Error adding patient").css('color', 'red');
            }
        });
    }
    else {
        $.ajax({
            url: `/update/${patientId}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(patientData),
            success: function () {
                alert("patient updated successfully")
                window.location.href = "/addPatient.html";
            },
            error: function () {
                $('#formError').text("Error updating patient").css('color', 'red');
            }

        });
    }
});

function loadPatientData(patientId) {
    $.ajax({
        url: `display/${patientId}`,
        type: "GET",
        success: function (patient) {
            $('#formSubmit').text('Update Patient');
            $('.name').val(patient.name);
            $('.code').val(patient.code)

            $('.phone').val(patient.mobileNumber);
            $('.date').val(patient.date);
            $('.fees').val(patient.fees);
            $('#doctorSelect').val(patient.doctor.id);
            $('.status').prop('checked', patient.status);
             $('#status').prop("disabled", true);
         if($('#status').prop("checked"))
         {
             $('#status').prop("disabled", false);
             $('#formSubmit').removeClass('disabled-button');
         }
            $('.slot').val(patient.timeSlot)
        },
        error: function () {
            alert('Error loading patient data');
        }
    });
}
$('.Clear').click(function () {
    if (patientId) {
        if (confirm('Are you sure that cancel updating..')) {
            setTimeout(function () { window.location.href = '/viewPatient.html' }, 100)

        }
    }
    $('#nameError').text('Enter full name (e.g., John Doe)').removeAttr('style').addClass('hind');
    $('#codeError').text("Start with 'P' followed by digits (e.g., P101)").removeAttr('style').addClass('hind');
    $('#phoneError').text('10-digit mobile number (e.g., 9876543210)').removeAttr('style').addClass('hint');
    $('#dateError').text('Choose admission or registration date').removeAttr('style').addClass('hint');
    $('#feesError').removeAttr('style').text('Minimum ₹350, numeric only').addClass('hint');
    $('#doctorSelect').removeAttr('style').text('Please assign a consulting doctor').addClass('hint');
    $('#statusError').removeAttr('style').text('Checked = Active').addClass('hint');

});

function renderSlotTable(alternatives) {
    const $tbody = $('#slotTable tbody');
    $tbody.empty(); // Clear existing rows

    if (alternatives.length === 0) {
        $tbody.append('<tr><td colspan="4">No alternative slots found</td></tr>');
        return;
    }
    else{
        
         $('#doctorNameDisplay').text(alternatives[0].doctor + ' - Available Slots');

  const $tbody = $('#slotTable tbody');
  $tbody.empty(); // Clear old rows

  alternatives.forEach(function (slot) {
    const row = `<tr class="slot-row" 
               data-doctor="${slot.doctor}" 
               data-date="${slot.date}" 
               data-slot="${slot.slot}">
  <td>${slot.date}</td>
  <td>${slot.slot}</td>
  <td>${slot.maxPatients}</td>
  <td>${slot.booked > 0 ? slot.booked : 0}</td>
</tr>`;
$tbody.append(row);
  });

  openModal(); // show modal after rows are added
  }
}
function openModal() {
  document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}
$(document).on('click', '.slot-row', function () {
  const doctorName = $(this).data('doctor');
  const slotTime = $(this).data('slot');
  const date = $(this).data('date');

  // Set values in the form
  $('#date').val(date);
  $('#slotSelect').val(slotTime);

  // Select the correct doctor in dropdown (by text)
  $('#doctorSelect option').filter(function () {
    return $(this).text().trim() === doctorName.trim();
  }).prop('selected', true);
$('#status').prop('checked',true)
  closeModal(); // Hide the modal
$('#formSubmit').removeClass('disabled-button');
});

