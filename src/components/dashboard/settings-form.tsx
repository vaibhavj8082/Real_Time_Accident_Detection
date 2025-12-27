'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleSettingsUpdate } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

const settingsSchema = z.object({
  accidentConfidenceThreshold: z.coerce.number().min(0).max(1),
  motionSensitivity: z.coerce.number().min(0).max(1),
});

export function SettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      accidentConfidenceThreshold: 0.8,
      motionSensitivity: 0.6,
    },
  });

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    setIsSubmitting(true);
    const result = await handleSettingsUpdate(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Settings Updated',
        description: result.success,
      });
    } else if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="accidentConfidenceThreshold"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Confidence Threshold</FormLabel>
                <span className="text-sm font-medium text-muted-foreground">
                  {field.value}
                </span>
              </div>
              <FormControl>
                <Slider
                  min={0}
                  max={1}
                  step={0.05}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Minimum confidence for an event to be an accident.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motionSensitivity"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Motion Sensitivity</FormLabel>
                 <span className="text-sm font-medium text-muted-foreground">
                  {field.value}
                </span>
              </div>
              <FormControl>
                <Slider
                  min={0}
                  max={1}
                  step={0.05}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Sensitivity to motion that triggers detection. Higher values require more motion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
