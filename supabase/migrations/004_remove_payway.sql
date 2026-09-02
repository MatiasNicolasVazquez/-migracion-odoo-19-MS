-- Remove unused Payway / card installment modules from shared migration control
DELETE FROM public.test_progress
WHERE module_id IN ('card_installment', 'payment_pay_way');
DELETE FROM public.module_status
WHERE module_id IN ('card_installment', 'payment_pay_way');
