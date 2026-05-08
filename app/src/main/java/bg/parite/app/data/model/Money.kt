package bg.parite.app.data.model

import java.math.BigDecimal
import java.math.RoundingMode
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

@JvmInline
value class Money(val minor: Long) {

    fun toBigDecimal(currency: String): BigDecimal {
        val scale = currencyScale(currency)
        return BigDecimal(minor).movePointLeft(scale)
    }

    fun format(currency: String, locale: Locale = Locale.getDefault()): String {
        val nf = NumberFormat.getCurrencyInstance(locale).apply {
            this.currency = Currency.getInstance(currency)
        }
        return nf.format(toBigDecimal(currency))
    }

    operator fun plus(other: Money) = Money(minor + other.minor)
    operator fun minus(other: Money) = Money(minor - other.minor)

    companion object {
        fun fromMajor(value: BigDecimal, currency: String): Money {
            val scale = currencyScale(currency)
            return Money(value.setScale(scale, RoundingMode.HALF_UP).movePointRight(scale).toLong())
        }

        fun fromString(input: String, currency: String): Money? {
            val cleaned = input.replace(',', '.').trim()
            val bd = cleaned.toBigDecimalOrNull() ?: return null
            return fromMajor(bd, currency)
        }

        private fun currencyScale(code: String): Int =
            runCatching { Currency.getInstance(code).defaultFractionDigits.coerceAtLeast(0) }
                .getOrDefault(2)
    }
}
