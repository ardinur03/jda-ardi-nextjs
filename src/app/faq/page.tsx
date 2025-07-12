import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
import { faqData } from '@/lib/faq-data';
import { Breadcrumb } from '@/components/breadcrumb';
  

export default function FAQPage() {
    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '/faq', label: 'FAQ', isCurrent: true },
      ];

    return (
      <main className="w-full bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />
            <div className="text-center mb-16">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Frequently Asked Questions
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
          </Accordion>
        </div>
      </main>
    );
  }
  