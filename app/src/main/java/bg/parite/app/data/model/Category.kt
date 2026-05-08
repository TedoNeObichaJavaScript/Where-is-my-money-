package bg.parite.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class CategoryKind { EXPENSE, INCOME }

@Entity(tableName = "categories")
data class Category(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val nameKey: String? = null,
    val kind: CategoryKind,
    val emoji: String,
    val colorHex: String,
    val sortOrder: Int = 0,
    val hidden: Boolean = false,
)
