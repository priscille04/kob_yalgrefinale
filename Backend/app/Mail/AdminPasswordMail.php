<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $plainPassword;

    public function __construct(string $plainPassword)
    {
        $this->plainPassword = $plainPassword;
    }

    public function build(): self
    {
        return $this->subject('Nouveau mot de passe Admin KOB-YALGRÉ')
            ->view('emails.admin_password')
            ->with([
                'plainPassword' => $this->plainPassword,
            ]);
    }
}

