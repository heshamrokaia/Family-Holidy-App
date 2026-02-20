'use client';

import { useState } from 'react';
import { shareContent, downloadImage } from '@/lib/sharing';
import { Button } from '@/components/ui/button';
import { Share2, Download, MessageCircle, Check, Loader2 } from 'lucide-react';

interface ShareSheetProps {
  cardDataUrl: string | null;
  title?: string;
  text?: string;
}

export default function ShareSheet({
  cardDataUrl,
  title = '30-Day Transformation',
  text = 'Check out my fasting transformation progress!',
}: ShareSheetProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (!cardDataUrl) return;
    setIsSharing(true);
    try {
      const success = await shareContent(cardDataUrl, title, text);
      if (success) {
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    if (!cardDataUrl) return;
    downloadImage(
      cardDataUrl,
      `transformation-day-${new Date().toISOString().split('T')[0]}.jpg`,
    );
  };

  const handleWhatsApp = async () => {
    if (!cardDataUrl) return;

    // Try native share first (includes WhatsApp), fallback to text-only link
    const success = await shareContent(cardDataUrl, title, text);
    if (!success) {
      const whatsappText = encodeURIComponent(
        `${text}\n\n📱 Track your own transformation at 30daytransformation.app`,
      );
      window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
    }
  };

  if (!cardDataUrl) {
    return (
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <Share2 className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Generate a transformation card above to share your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Share via Web Share API */}
        <Button
          onClick={handleShare}
          disabled={isSharing}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : shared ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {shared ? 'Shared!' : 'Share'}
        </Button>

        {/* WhatsApp */}
        <Button
          onClick={handleWhatsApp}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-green-500" />
          WhatsApp
        </Button>
      </div>

      {/* Download */}
      <Button
        onClick={handleDownload}
        variant="secondary"
        className="w-full flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Save to Photos (TikTok Ready)
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        Saved as 1080×1920 vertical format, perfect for TikTok & Instagram Stories
      </p>
    </div>
  );
}
