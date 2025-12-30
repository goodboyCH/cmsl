'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '../ScrollAnimation';
import { MapPin, Mail, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useLanguage } from '@/components/LanguageProvider'; // 1. Import

export function ContactPage() {
  const { t } = useLanguage(); // 2. Hook 사용
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (form.current) {
      emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then((result) => {
          setMessage(t('contact.success')); // 3. 번역 적용
          form.current?.reset();
      }, (error) => {
          setMessage(`${t('contact.fail')} ${error.text}`); // 3. 번역 적용
      })
      .finally(() => {
          setLoading(false);
      });
    }
  };

  return (
    <div className="container px-4 sm:px-8 py-8 md:py-12 space-y-12">
      <ScrollAnimation>
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">{t('contact.header.title')}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {t('contact.header.desc')}
          </p>
        </div>
      </ScrollAnimation>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left Side: Information & Map */}
        <ScrollAnimation delay={100} className="space-y-8">
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle>{t('contact.info.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">{t('contact.info.location')}</h4>
                  <p>{t('contact.addr.dept')}</p>
                  <p>{t('contact.addr.building')}</p>
                  <p>{t('contact.addr.street')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">{t('contact.info.pi')}</h4>
                  <a href="mailto:pilryung.cha@kookmin.ac.kr" className="hover:text-primary">
                    cprdream@kookmin.ac.kr
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">{t('contact.info.phone')}</h4>
                  <p>+82-2-910-4656</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle>{t('contact.map.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.592360130202!2d126.9939111!3d37.611751800000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbd1c2ede1e69%3A0xda831f42abef2d30!2z6rWt66-864yA7ZWZ6rWQIOqzte2Vmeq0gA!5e0!3m2!1sko!2skr!4v1758171361647!5m2!1sko!2skr" 
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Right Side: Contact Form */}
        <ScrollAnimation delay={200}>
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle>{t('contact.form.title')}</CardTitle>
              <CardDescription>
                {t('contact.form.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={form} onSubmit={sendEmail} className="space-y-4">
                <Input name="from_name" placeholder={t('contact.form.name')} required />
                <Input name="from_email" type="email" placeholder={t('contact.form.email')} required />
                <Input name="subject" placeholder={t('contact.form.subject')} required />
                <Textarea name="message" placeholder={t('contact.form.message')} rows={6} required />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('contact.form.sending') : t('contact.form.send')}
                </Button>
                {message && <p className="text-sm text-muted-foreground pt-2">{message}</p>}
              </form>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  );
}