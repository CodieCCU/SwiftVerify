package email

import (
	"fmt"
	"html"
)

// EmailTemplate represents an email template
type EmailTemplate struct {
	Subject     string
	HTMLBody    string
	TextBody    string
	UnsubToken  string
	RecipientEmail string
}

// GetUnsubscribeButton returns HTML for the unsubscribe button
func GetUnsubscribeButton(token, size string) string {
	buttonStyle := "background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 14px;"
	
	if size == "large" {
		buttonStyle = "background-color: #dc3545; color: white; padding: 16px 32px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;"
	}
	
	unsubscribeURL := fmt.Sprintf("https://swift-verify.org/unsubscribe/%s", token)
	
	return fmt.Sprintf(`
		<div style="text-align: center; margin: 20px 0;">
			<a href="%s" style="%s">UNSUBSCRIBE IMMEDIATELY</a>
		</div>
	`, unsubscribeURL, buttonStyle)
}

// GetUnsubscribeDisclosure returns the legal disclosure text
func GetUnsubscribeDisclosure() string {
	return `
		<div style="font-size: 12px; color: #666; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc3545;">
			<p style="margin: 0; font-weight: bold;">Unsubscribe from SwiftVerify emails:</p>
			<p style="margin: 5px 0 0 0;">
				Your unsubscribe request is processed <strong>IMMEDIATELY</strong>. 
				This action is permanently logged and audited at SwiftVerify, LLC.
			</p>
		</div>
	`
}

// GetEmailFooter returns the standard email footer with compliance info
func GetEmailFooter(unsubToken string) string {
	return fmt.Sprintf(`
		<div style="border-top: 2px solid #e9ecef; margin-top: 30px; padding-top: 20px;">
			%s
			%s
			
			<div style="text-align: center; font-size: 12px; color: #6c757d; margin-top: 20px;">
				<p style="margin: 5px 0;"><strong>SwiftVerify, LLC</strong></p>
				<p style="margin: 5px 0;">Boise, Idaho</p>
				<p style="margin: 5px 0;"><a href="https://swift-verify.org" style="color: #007bff;">www.swift-verify.org</a></p>
				<p style="margin: 5px 0;">support@swift-verify.org</p>
				<p style="margin: 15px 0 5px 0; font-size: 11px; color: #999;">
					This email is sent as part of our rental verification service.
					We never perform credit checks. This message complies with the CAN-SPAM Act.
				</p>
			</div>
		</div>
	`, GetUnsubscribeButton(unsubToken, "normal"), GetUnsubscribeDisclosure())
}

// BuildDenialEmail creates a denial email with unsubscribe
func BuildDenialEmail(recipientEmail, reason, unsubToken string) *EmailTemplate {
	subject := "SwiftVerify Application Update - Decision Required"
	
	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
	%s
	
	<h2 style="color: #333;">Application Status Update</h2>
	
	<div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
		<p style="margin: 0;"><strong>Important:</strong> Your application requires landlord review.</p>
	</div>
	
	<p>Dear Applicant,</p>
	
	<p>Thank you for using SwiftVerify for your rental application. After reviewing your application, we need to inform you:</p>
	
	<p><strong>Reason:</strong> %s</p>
	
	<div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 20px 0;">
		<h3 style="margin-top: 0; color: #495057;">Important Legal Notice - NOT from Equifax</h3>
		<p style="margin: 0; font-size: 14px;">
			<strong>SwiftVerify does NOT perform credit checks.</strong> This decision is NOT based on information from 
			Equifax or any credit bureau. This decision is based solely on identity verification, employment verification, 
			and optional background check information.
		</p>
		<p style="margin: 10px 0 0 0; font-size: 14px;">
			You have the right to appeal this decision. Contact your landlord or property manager for more information.
		</p>
	</div>
	
	<p>If you have questions about this decision, please contact your landlord or property manager directly.</p>
	
	<p>Sincerely,<br>SwiftVerify Team</p>
	
	%s
</body>
</html>
	`, GetUnsubscribeButton(unsubToken, "large"), html.EscapeString(reason), GetEmailFooter(unsubToken))
	
	return &EmailTemplate{
		Subject:        subject,
		HTMLBody:       htmlBody,
		UnsubToken:     unsubToken,
		RecipientEmail: recipientEmail,
	}
}

// BuildApprovalEmail creates an approval email with unsubscribe
func BuildApprovalEmail(recipientEmail, unsubToken string) *EmailTemplate {
	subject := "Congratulations! Your SwiftVerify Application is Approved"
	
	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
	%s
	
	<h2 style="color: #28a745;">🎉 Congratulations! Your Application is Approved</h2>
	
	<p>Dear Applicant,</p>
	
	<p>Great news! Your rental application has been approved through SwiftVerify.</p>
	
	<div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
		<h3 style="margin-top: 0; color: #155724;">Next Steps:</h3>
		<ol style="margin: 10px 0; padding-left: 20px;">
			<li>Review and sign your lease agreement</li>
			<li>Complete any required deposits</li>
			<li>Schedule your move-in date</li>
		</ol>
	</div>
	
	<p>Your landlord or property manager will contact you with additional details about the lease signing process.</p>
	
	<p>Sincerely,<br>SwiftVerify Team</p>
	
	%s
</body>
</html>
	`, GetUnsubscribeButton(unsubToken, "large"), GetEmailFooter(unsubToken))
	
	return &EmailTemplate{
		Subject:        subject,
		HTMLBody:       htmlBody,
		UnsubToken:     unsubToken,
		RecipientEmail: recipientEmail,
	}
}

// BuildWaiverEmail creates a waiver email with unsubscribe
func BuildWaiverEmail(recipientEmail string, waiverAmount float64, unsubToken string) *EmailTemplate {
	subject := "SwiftVerify Application Approved - Waiver Form Required"
	
	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
	%s
	
	<h2 style="color: #333;">Application Approved - Waiver Form Required</h2>
	
	<p>Dear Applicant,</p>
	
	<p>Good news! Your application has been approved.</p>
	
	<div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
		<p style="margin: 0;"><strong>Waiver Amount Required:</strong> $%.2f</p>
		<p style="margin: 10px 0 0 0;">Please review and acknowledge the waiver terms to continue with your lease signing.</p>
	</div>
	
	<p>Your landlord or property manager will provide you with the waiver form and additional instructions.</p>
	
	<p>Sincerely,<br>SwiftVerify Team</p>
	
	%s
</body>
</html>
	`, GetUnsubscribeButton(unsubToken, "large"), waiverAmount, GetEmailFooter(unsubToken))
	
	return &EmailTemplate{
		Subject:        subject,
		HTMLBody:       htmlBody,
		UnsubToken:     unsubToken,
		RecipientEmail: recipientEmail,
	}
}

// BuildGapPayEmail creates a gap pay email with unsubscribe
func BuildGapPayEmail(recipientEmail string, gapAmount float64, unsubToken string) *EmailTemplate {
	subject := "SwiftVerify Application Approved - Gap Pay Coverage"
	
	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
	%s
	
	<h2 style="color: #28a745;">🎉 Congratulations! Application Approved with Gap Pay</h2>
	
	<p>Dear Applicant,</p>
	
	<p>Your application has been approved!</p>
	
	<div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
		<p style="margin: 0;"><strong>Gap Pay Coverage:</strong> $%.2f/month</p>
		<p style="margin: 10px 0 0 0;">SwiftVerify will cover your income gap to ensure you meet the landlord's income requirements.</p>
	</div>
	
	<p>You can now proceed with lease signing. Your landlord will contact you with next steps.</p>
	
	<p>Sincerely,<br>SwiftVerify Team</p>
	
	%s
</body>
</html>
	`, GetUnsubscribeButton(unsubToken, "large"), gapAmount, GetEmailFooter(unsubToken))
	
	return &EmailTemplate{
		Subject:        subject,
		HTMLBody:       htmlBody,
		UnsubToken:     unsubToken,
		RecipientEmail: recipientEmail,
	}
}

// BuildLandlordAlertEmail creates a landlord alert email with unsubscribe
func BuildLandlordAlertEmail(recipientEmail, alertType, alertMessage, unsubToken string) *EmailTemplate {
	subject := fmt.Sprintf("SwiftVerify Alert - %s", alertType)
	
	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
	%s
	
	<h2 style="color: #333;">SwiftVerify Alert</h2>
	
	<div style="background-color: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
		<p style="margin: 0;"><strong>Alert Type:</strong> %s</p>
		<p style="margin: 10px 0 0 0;">%s</p>
	</div>
	
	<p>Please log in to your SwiftVerify landlord dashboard for more details.</p>
	
	<p>Sincerely,<br>SwiftVerify Team</p>
	
	%s
</body>
</html>
	`, GetUnsubscribeButton(unsubToken, "large"), html.EscapeString(alertType), html.EscapeString(alertMessage), GetEmailFooter(unsubToken))
	
	return &EmailTemplate{
		Subject:        subject,
		HTMLBody:       htmlBody,
		UnsubToken:     unsubToken,
		RecipientEmail: recipientEmail,
	}
}
