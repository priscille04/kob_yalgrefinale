<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $otp;

    public function __construct(string $otp)
    {
        $this->otp = $otp;
    }

    public function build(): self
    {
        return $this->subject('Votre code OTP Admin - KOB-YALGRÉ')
            ->view('emails.admin_otp')
            ->with([
                'otp' => $this->otp,
            ]);
    }
}

