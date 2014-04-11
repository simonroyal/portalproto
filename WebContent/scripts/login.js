$(document).ready(function ()
{
});

function validateCreateAccount()
{
	return validateForm("mainForm:submitMessages", "Cannot create account");
}

function validateRequestAccount()
{
	return validateForm("mainForm:submitMessages", "Cannot lookup user details");
}

function validateRequestReset()
{
	return validateForm("mainForm:submitMessages", "Cannot request password reset");
}

function validateResetAccount()
{
	return validateForm("mainForm:submitMessages", "Cannot reset password");
}

function validateLogin()
{
	return validateForm("mainForm:submitMessages", "Cannot login");
}

function validateSetPassword()
{
	return validateForm("mainForm:submitMessages", "Cannot set new password");
}

function validateForm(target, titleMessage)
{
	var valid = true;
	var selector;
	var fieldName;
	var value;
	var value2;
	var messagesId = escapeClientId(target);
	
	clearMessages(messagesId);
	addMessage(titleMessage, messagesId, true);
	
	$("label.required").each(function()
	{		
		if ($(this).children("span:first").text() == "*")
		{
			selector = escapeClientId($(this).attr("for"));
			value = $(selector).val().trim();
			
			if ($(selector).hasClass("defaultText"))
			{
				value = "";
			}
			
			if (value == "")
			{
				valid = false;
				fieldName = $(this).clone().children().remove().end().text();
				addMessage(fieldName + " is required", messagesId, false);
				$(this).addClass("error");
			}
			else
			{
				$(this).removeClass("error");
			}
		}
	});
	
	var match = $("input.passwordMatch");
		
	if (match && match.length == 2)
	{
		value = $("input.passwordMatch:eq(0)").val();
		value2 = $("input.passwordMatch:eq(1)").val();
		
		if (value != value2)
		{
			valid = false;
			addMessage("Passwords do not match", messagesId, false);
		}
	}
	
	if (valid)
	{
		$(messagesId).hide();
	}
	else
	{
		showMessages(messagesId);
	}
	
	return valid;
}