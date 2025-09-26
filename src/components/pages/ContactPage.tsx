import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '../ScrollAnimation';
import { MapPin, Mail, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';

export function ContactPage() {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (form.current) {
      emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
        form.current, 
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then((result) => {
          setMessage('메시지가 성공적으로 전송되었습니다!');
          form.current?.reset();
      }, (error) => {
          setMessage(`전송 실패: ${error.text}`);
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
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Contact Us</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Get in touch with our lab for collaborations, inquiries, or visits.
          </p>
        </div>
      </ScrollAnimation>
      
      {/* --- ⬇️ 모바일에서는 1열, md 이상에서는 2열 그리드로 수정 ⬇️ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left Side: Information & Map */}
        <ScrollAnimation delay={100} className="space-y-8">
          {/* Laboratory Information */}
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle>Laboratory Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Location</h4>
                  <p>School of Materials Science & Engineering </p>
                  <p>Kookmin University Engineering building Room 443</p>
                  <p>77 Jeongneung-ro, Seongbuk-gu, Seoul, 02707, Korea</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Principal Investigator</h4>
                  <a href="mailto:pilryung.cha@kookmin.ac.kr" className="hover:text-primary">
                    cprdream@kookmin.ac.kr
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <p>+82-2-910-4656</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Map */}
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle>Our Location on Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.592360130202!2d126.9939111!3d37.611751800000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbd1c2ede1e69%3A0xda831f42abef2d30!2z6rWt66-864yA7ZWZ6rWQIOqzte2Vmeq0gA!5e0!3m2!1sko!2skr!4v1758171361647!5m2!1sko!2skr" // 보내주신 주소로 교체 완료
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
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                아래 양식을 통해 문의사항을 보내주시면, 담당자가 확인 후 회신 드립니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={form} onSubmit={sendEmail} className="space-y-4">
                <Input name="from_name" placeholder="Your Name" required />
                <Input name="from_email" type="email" placeholder="Your Email" required />
                <Input name="subject" placeholder="Subject" required />
                <Textarea name="message" placeholder="Your Message" rows={6} required />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '전송 중...' : 'Send Message'}
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